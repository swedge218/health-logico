import {InjectRepository} from "@nestjs/typeorm";
import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    InternalServerErrorException
} from "@nestjs/common";
import {Connection, DeleteResult, getConnection, Repository, SelectQueryBuilder} from "typeorm";
import {Invoice} from "./invoice.entity";
import {CreateInvoiceDTO} from "./dto/create-invoice.dto";
import {InvoiceMapper} from "./invoice.mapper";
import {BaseModel} from "../../app.basemodel";
import {INVOICE_NUMBER_PREFIX, INVOICE_UPDATE_DISALLOWED} from "./constants/invoice.constants";
import {InvoiceItemModel} from "../../invoice-item/domain/invoice-item.model";
import {InvoiceItemMapper} from "../../invoice-item/domain/invoice-item.mapper";
import {CreateInvoiceItemDTO} from "../../invoice-item/domain/dto/create-invoice-item.dto";
import {PaymentMapper} from "../../payment/domain/payment.mapper";
import {PaymentStatusEnum} from "../../payment/domain/enums/payment-status.enum";
import {PaymentModel} from "../../payment/domain/payment.model";
import {InvoiceItem} from "../../invoice-item/domain/invoice-item.entity";
import {PriceModel} from "../../price/domain/price.model";
import {StockModel} from "../../stock/domain/stock.model";

export class InvoiceModel extends BaseModel{
    constructor(
        @InjectRepository(Invoice)
        private readonly repository: Repository<Invoice>,
        private connection: Connection = getConnection(),
        private invoiceItemModel: InvoiceItemModel,
        private priceModel: PriceModel,
        @Inject(forwardRef(() => PaymentModel))
        private paymentModel: PaymentModel,
        private stockModel: StockModel
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<Invoice>> {
        return this.repository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect("invoice.hospital", "hospital")
            .leftJoinAndSelect("hospital.location", "location")
            .leftJoinAndSelect("invoice.saleOfficer", "saleOfficer")
            .leftJoinAndSelect("invoice.invoiceItems", "invoiceItems")
            .leftJoinAndSelect("invoiceItems.product", "product")
            .leftJoinAndSelect("product.manufacturer", "manufacturer")
            .leftJoinAndSelect("invoice.payment", "payment");
    }

    async findAll(options: any): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;
        const count = await this.repository.count();
        const SQB = await this.findTemplate();

        return SQB
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return InvoiceModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Invoice> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
        return this.findTemplate().then(sqb => sqb.where({invoiceNumber: invoiceNumber}).getOne());
    }


    async findSummary(invoiceNumber: string): Promise<any[]> {
        return this.findTemplate()
            .then(sqb => {
                // return sqb.select('invoice.*')
                //     .addSelect('product.*')
                //     .addSelect('hospital.title', 'hospital_name')
                //     .addSelect('paid_amount', 'total_amount')
                //     .where("invoice_number = :invoiceNumber",
                //         {invoiceNumber: invoiceNumber})
                //     .getRawMany();

                return sqb.where("invoice_number = :invoiceNumber",
                        {invoiceNumber: invoiceNumber})
                    .getMany();
            })
    }


    async save(createInvoiceDTO: CreateInvoiceDTO): Promise<any> {
        let invoice: Invoice = new InvoiceMapper().fromDTO(createInvoiceDTO);
        invoice.invoiceNumber = await this.generateInvoiceNumber();
        const itemsList: JSON[] = createInvoiceDTO.items;
        let invoiceTotal: number = 0;
        const hospitalId: number = Number(createInvoiceDTO.hospital);

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            // return this.repository.save(invoice)
            return queryRunner.manager.save(invoice)
                .then(inv => {
                    invoice = inv;
                    return invoice;
                })
                .then((invoice): Promise<CreateInvoiceItemDTO[]> => {
                    return Promise.all(
                        itemsList.map(async (item) => {
                            const productId = item['product'];
                            const quantity = item['quantity'];
                            const batchNumber = item['batch_number'];

                            // check stock here
                            const isStocked = await this.stockModel.isStockedAndEnough(
                                productId, batchNumber, hospitalId, quantity, false);
                            if(!isStocked) {
                                await queryRunner.rollbackTransaction();
                                throw new BadRequestException(this.stockModel.stockFulfilmentFailureText(productId, batchNumber));
                            }

                            const unitPrice: number = await this.priceModel.findPrice(productId, batchNumber, false);
                            if(!unitPrice) {
                                await queryRunner.rollbackTransaction();
                                throw new BadRequestException(this.priceModel.priceNotSetErrorText(productId, batchNumber));
                            }

                            const amount = quantity * unitPrice;

                            const dto = await this.invoiceItemModel.setUpInvoiceItemDTO(
                                invoice, productId, quantity, batchNumber, unitPrice, amount);
                            const mappedInvoiceItem = new InvoiceItemMapper().fromDTO(dto);
                            const invoiceItem = queryRunner.manager.save(mappedInvoiceItem);
                            invoiceTotal += dto.amount;
                            return invoiceItem;
                        })
                    )
                }).then(() => {
                    const dto = this.paymentModel.setUpPaymentDTO(
                        invoice.invoiceNumber,
                        invoiceTotal,
                        PaymentStatusEnum.PENDING
                    );
                    const mappedPaymentItem = new PaymentMapper().fromDTO(dto)
                    return queryRunner.manager.save(mappedPaymentItem);
                }).then((payment) => {
                    invoice.payment = payment;
                    return queryRunner.manager.save(invoice);
                })
                .then(async (invoice) => {
                    console.log('Rolling back')
                    await queryRunner.commitTransaction();
                    return this.findOne(invoice.id);
                })
        } catch(err)  {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        }
    }


    async update(invoice: Invoice, createInvoiceDTO: CreateInvoiceDTO): Promise<any> {
        if(!(this.paymentModel.isUpdatable(invoice.payment))){
            throw new ForbiddenException(INVOICE_UPDATE_DISALLOWED)
        }

        invoice = new InvoiceMapper().updateInvoice(invoice, createInvoiceDTO);

        const itemsList: JSON[] = createInvoiceDTO.items;
        let invoiceTotal: number = 0;

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            return this.repository.save(invoice)
                .then(inv => {
                    invoice = inv;
                    return invoice;
                })
                .then(invoice => { //remove items from db
                    return Promise.all(
                        invoice.invoiceItems.map(async (item: InvoiceItem) => {
                            queryRunner.manager.remove(item);
                        })
                    )
                })
                .then(() => {
                    invoice.invoiceItems.length = 0; //expunge items from invoice object

                    return Promise.all(
                        itemsList.map(async (item) => {

                            const productId = item['product'];
                            const quantity = item['quantity'];
                            const batchNumber = item['batch_number'];

                            const unitPrice: number = await this.priceModel.findPrice(productId, batchNumber);
                            const amount = quantity * unitPrice;

                            return this.invoiceItemModel.createInvoiceItem(
                                invoice, productId, quantity, batchNumber, unitPrice, amount);
                        })
                    )
                })
                .then(async(invoiceItemsList) => {
                    return Promise.all(
                        invoiceItemsList.map(async (item) =>{
                            invoiceTotal += item.amount;
                            return await queryRunner.manager.save(item);
                        })
                    )
                })
                .then(async () => { //update the existing invoice
                    invoice.payment.invoiceAmount = invoiceTotal;
                    queryRunner.manager.save(invoice.payment);
                    // this.repository.queryRunner.connect();
                    queryRunner.commitTransaction();
                    return this.findOne(invoice.id);
                })
        } catch(err)  {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        }
    }


    // async update(id: number, createInvoiceDTO: CreateInvoiceDTO): Promise<Invoice> {
    //     const invoice: Invoice = new InvoiceMapper().fromDTO(createInvoiceDTO);
    //     return this.repository.update(id,  invoice)
    //         .then(() => { return this.findOne(id) })
    //         .catch((e) => {
    //             throw new InternalServerErrorException(e)
    //         })
    // }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }

    async generateInvoiceNumber(): Promise<string>{
        const sql = await this.repository
            .createQueryBuilder("invoice")
            .select("MAX(id)", "max")
            .getSql();

        return await this.repository
            .createQueryBuilder("invoice")
            .select("MAX(id)", "max")
            .getRawOne()
            .then(row => {
                let invoiceNumberSuffix: string = '';
                let invoiceNumber: number = 0;

                if(row.max == null)
                    invoiceNumber = 1;
                else
                    invoiceNumber = row.max + 1;

                if(invoiceNumber.toString().length == 1)
                    invoiceNumberSuffix = '000' + invoiceNumber;

                if(invoiceNumber.toString().length == 2)
                    invoiceNumberSuffix = '00' + invoiceNumber;

                if(invoiceNumber.toString().length == 3)
                    invoiceNumberSuffix = '0' + invoiceNumber;

                return `${INVOICE_NUMBER_PREFIX}-${invoiceNumberSuffix}`;
            })
    }
}
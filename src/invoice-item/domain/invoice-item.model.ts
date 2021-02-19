import {InjectRepository} from "@nestjs/typeorm";
import {InternalServerErrorException} from "@nestjs/common";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {InvoiceItem} from "./invoice-item.entity";
import {CreateInvoiceItemDTO} from "./dto/create-invoice-item.dto";
import {InvoiceItemMapper} from "./invoice-item.mapper";
import {BaseModel} from "../../app.basemodel";
import {Product} from "../../product/domain/product.entity";
import {Invoice} from "../../invoice/domain/invoice.entity";

export class InvoiceItemModel extends BaseModel{
    constructor(
        @InjectRepository(InvoiceItem)
        private readonly repository: Repository<InvoiceItem>,
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<InvoiceItem>> {
        return this.repository
            .createQueryBuilder('invoiceItem')
            .leftJoinAndSelect("invoiceItem.invoice", "invoice")
            .leftJoinAndSelect("invoiceItem.product", "product")
            .leftJoinAndSelect("product.manufacturer", "manufacturer")
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
                return InvoiceItemModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<InvoiceItem> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async save(createInvoiceItemDTO: CreateInvoiceItemDTO): Promise<InvoiceItem> {
        const invoiceItem: InvoiceItem = new InvoiceItemMapper().fromDTO(createInvoiceItemDTO);
        return this.repository.save(invoiceItem)
            .then(invoiceItem => invoiceItem)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createInvoiceItemDTO: CreateInvoiceItemDTO): Promise<InvoiceItem> {
        const invoiceItem: InvoiceItem = new InvoiceItemMapper().fromDTO(createInvoiceItemDTO);
        return this.repository.update(id,  invoiceItem)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }

    async removeEntity(invoiceItem: InvoiceItem): Promise<any> {
        return this.repository.remove(invoiceItem);
    }

    //invoice, productId, quantity, batchNumber, unitPrice, amount
    async createInvoiceItem(invoice: Invoice, product: Product, quantity: number, batchNumber: string,
                            unitCost: number, amount: number): Promise<InvoiceItem> {

        return this.setUpInvoiceItemDTO(invoice, product, quantity, batchNumber, unitCost, amount)
            .then(dto => {
                const invoiceItem = new InvoiceItemMapper().fromDTO(dto);
                return invoiceItem;
            })

    }
    async setUpInvoiceItemDTO(invoice: Invoice, product: Product, quantity: number, batchNumber: string,
                                unitCost: number, amount: number): Promise<CreateInvoiceItemDTO> {

        return new InvoiceItemMapper().toDTO(
            invoice, product, batchNumber, unitCost, quantity, amount
        );

    }
}
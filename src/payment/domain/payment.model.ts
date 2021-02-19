import {InjectRepository} from "@nestjs/typeorm";
import {
    forwardRef,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException
} from "@nestjs/common";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Payment} from "./payment.entity";
import {CreatePaymentDTO} from "./dto/create-payment.dto";
import {PaymentMapper} from "./payment.mapper";
import {BaseModel} from "../../app.basemodel";
import {PaymentStatusEnum} from "./enums/payment-status.enum";
import {AdjustmentModel} from "../../adjustment/domain/adjustment.model";
import {InvoiceModel} from "../../invoice/domain/invoice.model";
import {SALE_SUCCESS_REMARK} from "./constants/payment.constants";
import {AdjustmentActionEnums} from "../../adjustment/domain/enums/adjustment.type.enums";

export class PaymentModel extends BaseModel{
    constructor(
        @InjectRepository(Payment)
        protected readonly repository: Repository<Payment>,
        private adjustmentModel: AdjustmentModel,
        @Inject(forwardRef(() => InvoiceModel))
        private readonly invoiceModel: InvoiceModel
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<Payment>> {
        return this.repository
            .createQueryBuilder('payment')
            .leftJoinAndSelect("payment.invoice", "invoice")
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
                return PaymentModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Payment> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findStatus(invoiceNumber: string): Promise<Payment> {
        return this.findTemplate().then(sqb => {
            return sqb
                .select('status')
                .where({invoiceNumber: invoiceNumber})
                .getRawOne()
                .then(status => {
                    return status !== undefined ? status : {status: PaymentStatusEnum.NOT_FOUND};
                })
        })
    }


    async findByInvoiceNumber(invoiceNumber: string): Promise<any> {
        return this.findTemplate().then(sqb => {
            return sqb.where({invoiceNumber: invoiceNumber}).getOne();
        });
    }

    async save(createPaymentDTO: CreatePaymentDTO): Promise<Payment> {
        const payment: Payment = new PaymentMapper().fromDTO(createPaymentDTO);
        return this.repository.save(payment)
            .then(payment => payment)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createPaymentDTO: CreatePaymentDTO): Promise<Payment> {
        const payment: Payment = new PaymentMapper().fromDTO(createPaymentDTO);
        return this.repository.update(id,  payment)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async updateAmount(paymentId: number, amount: number): Promise<Payment> {
        return this.findOne(paymentId)
            .then(payment => {
                payment.invoiceAmount = amount;
                return this.repository.save(payment);
            })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    isUpdatable(payment: Payment): boolean {
        return payment.status === PaymentStatusEnum.PENDING;
    }

    setUpPaymentDTO(invoiceNumber: string, amount: number,
                    status: PaymentStatusEnum): CreatePaymentDTO {
        return new PaymentMapper().toDTO(invoiceNumber, amount, status);
    }

    async updateStock(invoiceId: number): Promise<void> {
        this.invoiceModel.findOne(invoiceId)
            .then(invoice => {
                const invoiceItems = invoice.invoiceItems;

                invoiceItems.map((item) => {
                    this.adjustmentModel.downAdjustment(
                        item.product, item.quantity, item.batchNumber,
                        AdjustmentActionEnums.SALE, SALE_SUCCESS_REMARK, invoice.hospital
                    )
                })
            })
    }
}
import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Invoice} from "../../invoice/domain/invoice.entity";
import {BaseEntity} from "../../app.baseentity";
import {PaymentStatusEnum} from "./enums/payment-status.enum";
import {PaymentChannelsEnum} from "./enums/payment-channels.enum";

@Entity()
export class Payment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    invoiceNumber: string;

    @Column({ nullable: true })
    statusCode: string;

    @Column({ nullable: true })
    statusDescription: string;

    @Column({ nullable: true, default: 0 })
    invoiceAmount: number;

    @Column({ name: 'paid_amount', nullable: true, default: 0 })
    paidAmount: number;

    @Column({ nullable: true })
    currency: string;

    @Column({ nullable: true })
    type: string;

    @Column({ nullable: true })
    transactionReference: string;

    @Column({ nullable: true })
    maskedPAN: string;

    @Column({ nullable: true })
    cardScheme: string;

    @Column({ nullable: true })
    customerName: string;

    @Column({ nullable: true })
    retrievalReferenceNumber: string;

    @Column({ name:'payment_date', nullable: true })
    paymentDate: string;

    @Column("enum", { enum: PaymentStatusEnum, nullable: false })
    status: string;

    @Column("enum", { enum: PaymentChannelsEnum, nullable: false })
    channel: string;

    @OneToOne(() => Invoice, invoice => invoice.payment)
    invoice: Invoice;
}
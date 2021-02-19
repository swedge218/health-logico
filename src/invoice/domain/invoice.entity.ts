import {BaseEntity} from "../../app.baseentity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../user/domain/user.entity";
import {Payment} from "../../payment/domain/payment.entity";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {InvoiceItem} from "../../invoice-item/domain/invoice-item.entity";

@Entity()
export class Invoice extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, name: 'invoice_number' })
    invoiceNumber: string;

    @ManyToOne(type => Hospital, { eager: true })
    @JoinColumn({ name: "hospital_id", referencedColumnName: 'id'})
    hospital: Hospital;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn({ name: "user_id", referencedColumnName: 'id'})
    saleOfficer: User;

    @OneToOne(() => Payment)
    @JoinColumn({ name: "payment_id"})
    payment: Payment;

    @OneToMany(
        type => InvoiceItem,
        invoiceItem => invoiceItem.invoice,
        {onDelete: "CASCADE", onUpdate: "CASCADE"}
        // { cascade: ['insert', 'update'], onDelete: "CASCADE", onUpdate: "CASCADE" },
    )
    invoiceItems: InvoiceItem[];
}
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {DeliveryStatus} from "../../delivery-status/domain/delivery-status.entity";
import {User} from "../../user/domain/user.entity";
import {BaseEntity} from "../../app.baseentity";
import {ProcurementItem} from "../../procurement-item/domain/procurement-item.entity";

@Entity()
export class Procurement extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({ name: 'batch_number', nullable: false })
    // batchNumber:string;

    // @Column({ name: 'expiry_date', nullable: false })
    // expiryDate:string;

    // @Column({ name: 'date_dispatched', nullable: false })
    // dateDispatched:string;

    @Column({ name: 'date_received', nullable: false })
    dateReceived:string;

    @Column({ name: 'remarks', nullable: true })
    remarks:string;

    // @Column({ name: 'quantity_received', nullable: false })
    // quantityReceived:string;

    // @OneToMany()
    // product: Product;

    @ManyToOne(type => DeliveryStatus, { eager: true })
    @JoinColumn({ name: "delivery_status_id", referencedColumnName: 'id'})
    deliveryStatus: DeliveryStatus;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn({ name: "processing_officer_id", referencedColumnName: 'id'})
    processingOfficer: User;

    @OneToMany(type => ProcurementItem, procurementItem => procurementItem.procurement)
    procurementItems: ProcurementItem[];
}
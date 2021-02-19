import {Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import {BaseEntity} from "../../app.baseentity";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {User} from "../../user/domain/user.entity";
import {OrderStatus} from "../../order-status/domain/order-status.entity";
import {OrderItem} from "../../order-item/domain/order-item.entity";

@Entity()
export class Order extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Hospital, { eager: true })
    @JoinColumn({ name: "hospital_id", referencedColumnName: 'id' })
    hospital: Hospital;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn({ name: "processing_officer_id", referencedColumnName: 'id' })
    processingOfficer: User;

    @ManyToOne(type => OrderStatus, { eager: true })
    @JoinColumn({ name: "status_id", referencedColumnName: 'id' })
    status: OrderStatus;

    @OneToMany(type => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];

}
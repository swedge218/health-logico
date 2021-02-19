import {Column, PrimaryGeneratedColumn, Entity} from "typeorm";
import {BaseEntity} from "../../app.baseentity";

@Entity("order_status")
export class OrderStatus extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    alias: string;

    @Column({ name: 'sort_order', type: Number, nullable: false })
    sortOrder: number;
}
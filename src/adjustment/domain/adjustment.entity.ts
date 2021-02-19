import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../product/domain/product.entity";
import {BaseEntity} from "../../app.baseentity";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {AdjustmentActionEnums, AdjustmentTypeEnums} from "./enums/adjustment.type.enums";

@Entity()
export class Adjustment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Product, { eager: true })
    @JoinColumn({ name: "product_id", referencedColumnName: 'id'})
    product: Product;

    @Column({ name: 'batch_number', nullable: true })
    batchNumber: string;

    // @Column({
    //     name: 'adjustment_type',
    //     nullable: false,
    //     comment: 'up - 1, down - 2' })

    @Column("enum", {
        enum: AdjustmentTypeEnums,
        name: 'adjustment_type',
        nullable: false,
        default: AdjustmentTypeEnums.INIT})
    adjustmentType: AdjustmentTypeEnums;

    @Column("enum", {
        enum: AdjustmentActionEnums,
        name: 'adjustment_action',
        nullable: false,
        default: AdjustmentActionEnums.INIT})
    adjustmentAction: AdjustmentActionEnums;

    @Column({ nullable: false })
    quantity: number;

    @ManyToOne(type => Hospital, { eager: true })
    @JoinColumn({ name: "hospital_id", referencedColumnName: 'id' })
    hospital: Hospital;

    @Column({ nullable: false })
    remarks: string;
}
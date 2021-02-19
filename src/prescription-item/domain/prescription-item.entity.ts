import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../product/domain/product.entity";
import {BaseEntity} from "../../app.baseentity";
import {Prescription} from "../../prescription/domain/prescription.entity";

@Entity()
export class PrescriptionItem extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dosage: string;

    @ManyToOne(type => Product, { eager: true })
    @JoinColumn({ name: "product_id", referencedColumnName: 'id' })
    product: Product;

    @ManyToOne(type => Prescription, { eager: true })
    @JoinColumn({ name: "prescription_id", referencedColumnName: 'id' })
    prescription: Prescription;
}
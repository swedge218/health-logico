import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../product/domain/product.entity";
import {BaseEntity} from "../../app.baseentity";
import {Hospital} from "../../hospital/domain/hospital.entity";

@Entity()
export class Stock extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Product, { eager: true })
    @JoinColumn({ name: "product_id", referencedColumnName: 'id'})
    product: Product;

    @Column({ name: 'batch_number', nullable: true })
    batchNumber: string;

    @Column({ nullable: false })
    quantity: number;

    @ManyToOne(type => Hospital, { eager: true })
    @JoinColumn({ name: "hospital_id", referencedColumnName: 'id' })
    hospital: Hospital;
}
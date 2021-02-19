import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../product/domain/product.entity";
import {BaseEntity} from "../../app.baseentity";
import {Procurement} from "../../procurement/domain/procurement.entity";

@Entity()
export class ProcurementItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'batch_number', nullable: false })
    batchNumber: string;

    @Column({ name: 'expiry_date', nullable: false })
    expiryDate: string;

    @Column({ name: 'quantity_received', nullable: false })
    quantityReceived: number;
    
    @ManyToOne(type => Product, { eager: true })
    @JoinColumn({ name: "product_id", referencedColumnName: 'id'})
    product: Product;

    @ManyToOne(type => Procurement, { eager: true })
    @JoinColumn({ name: "procurement_id", referencedColumnName: 'id'})
    procurement: Procurement;
}
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../product/domain/product.entity";
import {BaseEntity} from "../../app.baseentity";
import {Stock} from "../../stock/domain/stock.entity";

@Entity()
export class Price extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Product, { eager: true })
    @JoinColumn({ name: "product_id", referencedColumnName: 'id'})
    product: Product;

    @Column({ name: 'batch_number', nullable: false })
    batchNumber: string;

    @Column({ name: 'unit_cost', nullable: false })
    unitCost: number;

    // @OneToOne(() => Stock)
    // @JoinColumn({ name: "stock_id" })
    // stock: Stock;
}
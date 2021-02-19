import {BaseEntity} from "../../app.baseentity";
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "../../product/domain/product.entity";
import {Invoice} from "../../invoice/domain/invoice.entity";

@Entity()
export class InvoiceItem extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Invoice, { eager: true, nullable: false })
    @JoinColumn({ name: "invoice_id", referencedColumnName: 'id'})
    invoice: Invoice;

    @ManyToOne(type => Product, { eager: true })
    @JoinColumn({ name: "product_id", referencedColumnName: 'id'})
    product: Product;

    // @Column()
    // expiryDate: string;

    @Column()
    batchNumber: string;

    @Column()
    unitCost: number;

    @Column()
    quantity: number;

    @Column()
    amount: number;
}
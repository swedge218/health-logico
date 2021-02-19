import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Manufacturer} from "../../manufacturer/domain/manufacturer.entity";
import {BaseEntity} from "../../app.baseentity";
import {Adjustment} from "../../adjustment/domain/adjustment.entity";
import {Stock} from "../../stock/domain/stock.entity";
import {InvoiceItem} from "../../invoice-item/domain/invoice-item.entity";
import {ProcurementItem} from "../../procurement-item/domain/procurement-item.entity";
import {Price} from "../../price/domain/price.entity";

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'brand_name', length: 50, nullable: false })
    brandName: string;

    @Column({ length: 20, nullable: false })
    formulation: string;

    @Column({ name: 'generic_name', length: 50, nullable: false })
    genericName: string;

    @Column({ length: 20, nullable: false })
    strength: string;

    @Column({ name: 'threshold_value', nullable: false })
    thresholdValue: number;

    // @Column({ name: 'unit_cost', nullable: false })
    // unitCost: number;

    @ManyToOne(type => Manufacturer, { eager: true })
    @JoinColumn({ name: "manufacturer_id", referencedColumnName: 'id'})
    manufacturer: Manufacturer;

    @OneToMany(type => Adjustment, adjustment => adjustment.product)
    adjustments: Adjustment[];

    @OneToMany(type => Stock, stock => stock.product)
    stock: Stock[];

    @OneToMany(type => InvoiceItem, invoiceItem => invoiceItem.product)
    invoiceItem: InvoiceItem[];

    @OneToMany(type => ProcurementItem, procurementItem => procurementItem.product)
    procurementItem: ProcurementItem[];

    @OneToMany(type => Price, price => price.product)
    price: Price[];
}
import {Column, PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, OneToOne, JoinColumn} from "typeorm";
import {BaseEntity} from "../../app.baseentity";
import {Product} from "../../product/domain/product.entity";
import {Order} from "../../order/domain/order.entity";
import {StockIssueItem} from "../../stock-issue-item/domain/stock-issue-item.entity";

@Entity("order_item")
export class OrderItem extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'ordered_quantity', type: "int", nullable: false })
    orderedQuantity: number;

    @ManyToOne(type => Product, { eager: true })
    @JoinColumn({ name: "product_id", referencedColumnName: 'id' })
    product: Product;

    @ManyToOne(type => Order, { eager: true })
    @JoinColumn({ name: "order_id", referencedColumnName: 'id' })
    order: Order;

    // @OneToOne(() => StockIssueItem, stockIssueItem => stockIssueItem.orderItem)
    @OneToMany(type => StockIssueItem, stockIssueItem => stockIssueItem.orderItem)
    stockIssueItem: StockIssueItem;

}
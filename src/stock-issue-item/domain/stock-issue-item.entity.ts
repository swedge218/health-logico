import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../app.baseentity";
import {OrderItem} from "../../order-item/domain/order-item.entity";
import {StockIssue} from "../../stock-issue/domain/stock-issue.entity";
import {StockReceiptItem} from "../../stock-receipt-item/domain/stock-receipt-item.entity";
import {StockIssueStatusEnums} from "../../stock-issue/domain/enums/stock-issue-enums";

@Entity()
export class StockIssueItem extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'quantity_issued'})
    quantityIssued: number;

    @Column({ name: 'batch_number', nullable: false })
    batchNumber: string;

    @Column("enum", { enum: StockIssueStatusEnums, nullable: false, default: StockIssueStatusEnums.UNATTENDED })
    status: StockIssueStatusEnums;

    // @OneToOne(() => OrderItem, orderItem => orderItem.stockIssueItem)
    @ManyToOne(type => OrderItem, { eager: true })
    @JoinColumn({ name: "order_item_id"})
    orderItem: OrderItem;

    @ManyToOne(type => StockIssue, { eager: true })
    @JoinColumn({ name: "issue_id", referencedColumnName: 'id'})
    stockIssue: StockIssue;

    @OneToOne(() => StockReceiptItem)
    stockReceiptItem: StockReceiptItem;

}
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../app.baseentity";
import {StockReceipt} from "../../stock-receipt/domain/stock-receipt.entity";
import {StockIssueItem} from "../../stock-issue-item/domain/stock-issue-item.entity";

@Entity()
export class StockReceiptItem extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'quantity_received'})
    quantityReceived: number;

    @Column({ name: 'batch_number', nullable: false })
    batchNumber: string;

    @OneToOne(() => StockIssueItem, { onDelete: "CASCADE", onUpdate: "CASCADE"})
    @JoinColumn({ name: "stock_issue_item_id", })
    issueItem: StockIssueItem;

    @ManyToOne(type => StockReceipt, { eager: true })
    @JoinColumn({ name: "receipt_id", referencedColumnName: 'id'})
    stockReceipt: StockReceipt;

    // @ManyToOne(type => Hospital, { eager: true })
    // @JoinColumn({ name: "hospital_id", referencedColumnName: 'id'})
    // hospital: Hospital;
}
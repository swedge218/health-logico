import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {BaseEntity} from "../../app.baseentity";
import {StockIssue} from "../../stock-issue/domain/stock-issue.entity";
import {StockReceiptItem} from "../../stock-receipt-item/domain/stock-receipt-item.entity";

@Entity()
export class StockReceipt extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'receipt_date'})
    receiptDate: string;

    @ManyToOne(type => StockIssue, { eager: true })
    @JoinColumn({ name: "stock_issue_id", referencedColumnName: 'id'})
    stockIssue: StockIssue;

    @ManyToOne(type => Hospital, { eager: true })
    @JoinColumn({ name: "hospital_id", referencedColumnName: 'id'})
    hospital: Hospital;

    @Column({ name: "receipt_type", comment: "1-normal, 2-emergency stock receipt"})
    receiptType: number;

    @OneToMany(
        type => StockReceiptItem,
        stockReceiptItem => stockReceiptItem.stockReceipt
    )
    stockReceiptItems: StockReceiptItem[];
}
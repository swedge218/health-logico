import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../app.baseentity";
import {User} from "../../user/domain/user.entity";
import {Order} from "../../order/domain/order.entity";
import {StockIssueItem} from "../../stock-issue-item/domain/stock-issue-item.entity";
import {StockIssueStatusEnums} from "./enums/stock-issue-enums";

@Entity()
export class StockIssue extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'issue_date'})
    issueDate: string;

    @ManyToOne(type => Order, { eager: true })
    @JoinColumn({ name: "order_id", referencedColumnName: 'id'})
    order: Order;

    @ManyToOne(type => User, { eager: true })
    @JoinColumn({ name: "user_id", referencedColumnName: 'id'})
    issuingOfficer: User;

    @Column({name: 'issue_type', default: 1, comment: '1 - normal, 2 - emergency'})
    issueType: number;

    @Column("enum", { enum: StockIssueStatusEnums, nullable: false, default: StockIssueStatusEnums.UNATTENDED })
    status: StockIssueStatusEnums;

    @OneToMany(type => StockIssueItem, stockIssueItem => stockIssueItem.stockIssue)
    stockIssueItems: StockIssueItem[];
}
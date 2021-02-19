import { Column, Entity, PrimaryGeneratedColumn  } from 'typeorm';
import {BaseEntity} from "../../app.baseentity";
import {StockIssueStatusEnums} from "../../stock-issue/domain/enums/stock-issue-enums";
import {PermissionCategoriesEnum} from "../seeder/domain/permission-categories.enum";

@Entity()
export class Permission extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column("enum", { enum: PermissionCategoriesEnum, nullable: false })
    category: PermissionCategoriesEnum;

    @Column({ name: "sort_order", default: 0})
    sortOrder: number;
}
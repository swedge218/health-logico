import { Module } from '@nestjs/common';
import { StockIssueItemController } from './stock-issue-item.controller';
import { StockIssueItemService } from './stock-issue-item.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockIssueItem} from "./domain/stock-issue-item.entity";
import {StockIssueItemModel} from "./domain/stock-issue-item.model";
import {AdjustmentModule} from "../adjustment/adjustment.module";
import {OrderItemModule} from "../order-item/order-item.module";

@Module({
    imports: [
        AdjustmentModule,
        OrderItemModule,
        TypeOrmModule.forFeature([StockIssueItem])
    ],
    controllers: [StockIssueItemController],
    providers: [StockIssueItemService, StockIssueItemModel],
    exports: [StockIssueItemModel]
})
export class StockIssueItemModule {}

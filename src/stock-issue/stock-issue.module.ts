import { Module } from '@nestjs/common';
import { StockIssueController } from './stock-issue.controller';
import { StockIssueService } from './stock-issue.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockIssue} from "../stock-issue/domain/stock-issue.entity";
import {StockIssueModel} from "../stock-issue/domain/stock-issue.model";
import {EmergencyStockIssueModel} from "./domain/stock-issue-emergency.model";
import {OrderModule} from "../order/order.module";
import {OrderItemModule} from "../order-item/order-item.module";
import {StockIssueItemModule} from "../stock-issue-item/stock-issue-item.module";
import {AdjustmentModule} from "../adjustment/adjustment.module";
import {StockModule} from "../stock/stock.module";

@Module({
    imports: [
        OrderModule,
        OrderItemModule,
        StockIssueItemModule,
        AdjustmentModule,
        StockModule,
        TypeOrmModule.forFeature([StockIssue])],
    controllers: [StockIssueController],
    providers: [StockIssueService, StockIssueModel, EmergencyStockIssueModel],
    exports: [StockIssueModel]
})
export class StockIssueModule {}

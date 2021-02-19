import { Module } from '@nestjs/common';
import {StockReceiptController} from "./stock-receipt.controller";
import {StockReceiptService} from "./stock-receipt.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockReceipt} from "./domain/stock-receipt.entity";
import {StockReceiptModel} from "./domain/stock-receipt.model";
import {StockReceiptItemModule} from "../stock-receipt-item/stock-receipt-item.module";
import {StockIssueItemModule} from "../stock-issue-item/stock-issue-item.module";
import {StockIssueModule} from "../stock-issue/stock-issue.module";
import {AdjustmentModule} from "../adjustment/adjustment.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([StockReceipt]),
        StockReceiptItemModule,
        StockIssueItemModule,
        StockIssueModule,
        AdjustmentModule
    ],
    controllers: [StockReceiptController],
    providers: [StockReceiptService, StockReceiptModel]
})
export class StockReceiptModule {}

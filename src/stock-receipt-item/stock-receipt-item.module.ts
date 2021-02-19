import { Module } from '@nestjs/common';
import {StockReceiptItemController} from "./stock-receipt-item.controller";
import {StockReceiptItemService} from "./stock-receipt-item.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockReceiptItem} from "./domain/stock-receipt-item.entity";
import {StockReceiptItemModel} from "./domain/stock-receipt-item.model";
import {AdjustmentModule} from "../adjustment/adjustment.module";

@Module({
    imports: [
        AdjustmentModule,
        TypeOrmModule.forFeature([StockReceiptItem])
    ],
    controllers: [StockReceiptItemController],
    providers: [StockReceiptItemService, StockReceiptItemModel],
    exports: [StockReceiptItemModel]
})
export class StockReceiptItemModule {}

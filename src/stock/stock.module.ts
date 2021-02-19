import {forwardRef, Module} from '@nestjs/common';
import {StockController} from "./stock.controller";
import {StockService} from "./stock.service";
import {Stock} from "./domain/stock.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockModel} from "./domain/stock.model";
import {AdjustmentModule} from "../adjustment/adjustment.module";
import {PriceModule} from "../price/price.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Stock]),
        forwardRef(() => AdjustmentModule),
        PriceModule
    ],
    controllers: [StockController],
    providers: [StockService, StockModel],
    exports: [StockService, StockModel]
})
export class StockModule {}

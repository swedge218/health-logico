import {forwardRef, Module} from '@nestjs/common';
import {AdjustmentController} from "./adjustment.controller";
import {AdjustmentService} from "./adjustment.service";
import {Adjustment} from "./domain/adjustment.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AdjustmentModel} from "./domain/adjustment.model";
import {StockModule} from "../stock/stock.module";
import {ProductModule} from "../product/product.module";

@Module({
    imports: [
        forwardRef(() => StockModule),
        forwardRef(() => ProductModule),
        TypeOrmModule.forFeature([Adjustment])
    ],
    controllers: [AdjustmentController],
    providers:[AdjustmentService, AdjustmentModel],
    exports: [AdjustmentService, AdjustmentModel]
})
export class AdjustmentModule {}

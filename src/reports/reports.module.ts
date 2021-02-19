import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import {HomeReport} from "./domain/model/home.report";
import {ProductModule} from "../product/product.module";
import {DateFilters} from "./domain/filters/date.filters";
import {EntityFilters} from "./domain/filters/entity.filters";
import {ConsumptionReportController} from "./controllers/cosumption.report.controller";
import {ConsumptionReportService} from "./services/consumption.report.service";
import {ConsumptionReport} from "./domain/model/consumption.report";
import {StockReportController} from "./controllers/stock.report.controller";
import {StockReportService} from "./services/stock.report.service";
import {StockReport} from "./domain/model/stock.report";

@Module({
    imports: [
        ProductModule
    ],
    controllers: [
        ReportsController,
        ConsumptionReportController,
        StockReportController
    ],
    providers: [
        ReportsService,
        ConsumptionReportService,
        StockReportService,
        HomeReport,
        ConsumptionReport,
        StockReport,
        DateFilters,
        EntityFilters
    ]
})
export class ReportsModule {}

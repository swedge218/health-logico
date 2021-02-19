import { Injectable } from '@nestjs/common';
import {HomeReport} from "../domain/model/home.report";
import {DateFilterDTO} from "../domain/dto/date-filter.dto";
import {ProductFilterDTO} from "../domain/dto/product-filter.dto";

@Injectable()
export class ReportsService {

    constructor(
        private homeReportModel: HomeReport,
    ) {}


    async findHomeDataPoints(): Promise<any> {
        return this.homeReportModel.findHomeDataPoints();
    }

    async findHomeSummaries(dateFilterDTO: DateFilterDTO): Promise<any> {
        return this.homeReportModel.findHomeSummaries(dateFilterDTO);
    }

    async findStock(productId: number): Promise<any> {
        return this.homeReportModel.findHomeStockData(productId);
    }

    async findSalesQuantityVolumes(
        dateFilterDTO: DateFilterDTO, productFilterDTO: ProductFilterDTO): Promise<any> {
        return this.homeReportModel.findSalesQuantityByProductVolumes(
            dateFilterDTO, productFilterDTO);
    }
}
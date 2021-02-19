import {DateFilterDTO} from "../domain/dto/date-filter.dto";
import {HospitalFilterDTO} from "../domain/dto/hospital-filter.dto";
import {StockReport} from "../domain/model/stock.report";
import {Injectable} from "@nestjs/common";

@Injectable()
export class StockReportService {

    constructor(
        private stockReport: StockReport,
    ) {}

    async findStockSummaries(dateFilterDTO?: DateFilterDTO, hospitalFilterDTO?: HospitalFilterDTO): Promise<any> {
        return this.stockReport.findStockSummaries(dateFilterDTO, hospitalFilterDTO);
    }
}
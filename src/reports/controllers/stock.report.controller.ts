import {StockReportService} from "../services/stock.report.service";
import {Body, Controller, Get} from "@nestjs/common";
import {DateFilterDTO} from "../domain/dto/date-filter.dto";
import {HospitalFilterDTO} from "../domain/dto/hospital-filter.dto";

@Controller('reports/stock')
export class StockReportController {
    constructor(private readonly stockReportService: StockReportService){}

    @Get('/summaries')
    async findStockSummaries (
        @Body() dateFilterDTO: DateFilterDTO,
        @Body() hospitalFilterDTO: HospitalFilterDTO): Promise<any> {

        return this.stockReportService.findStockSummaries(dateFilterDTO, hospitalFilterDTO);
    }
}
import {Body, Controller, Get} from "@nestjs/common";
import {DateFilterDTO} from "../domain/dto/date-filter.dto";
import {ConsumptionReportService} from "../services/consumption.report.service";
import {HospitalFilterDTO} from "../domain/dto/hospital-filter.dto";
import {ProductFilterDTO} from "../domain/dto/product-filter.dto";

@Controller('reports/consumption')
export class ConsumptionReportController {
    constructor(private readonly consumptionService: ConsumptionReportService){}

    @Get('/volumes')
    async findConsumptionByHospitals(
        @Body() dateFilterDTO: DateFilterDTO,
        @Body() hospitalFilterDTO: HospitalFilterDTO): Promise<any> {

        return this.consumptionService.findConsumptionByHospitals(dateFilterDTO, hospitalFilterDTO);
    }


    @Get('/volume-quantified')
    async findStockReceiptsByHospital(
        @Body() dateFilterDTO: DateFilterDTO,
        @Body() hospitalFilterDTO: HospitalFilterDTO): Promise<any> {

        return this.consumptionService.findStockReceiptsByHospital(dateFilterDTO, hospitalFilterDTO);
    }


    @Get('/volume-sold-quantity-by-hospital')
    async findSalesQuantityTotalByHospital(
        @Body() dateFilterDTO: DateFilterDTO,
        @Body() hospitalFilterDTO: HospitalFilterDTO): Promise<any> {

        return this.consumptionService.findSalesQuantityTotalByHospital(dateFilterDTO, hospitalFilterDTO);
    }

    @Get('/volume-sold-amount-by-hospital')
    async findSalesAmountTotalByHospital(
        @Body() dateFilterDTO: DateFilterDTO,
        @Body() hospitalFilterDTO: HospitalFilterDTO): Promise<any> {

        return this.consumptionService.findSalesAmountTotalByHospital(dateFilterDTO, hospitalFilterDTO);
    }

    @Get('/volume-sold-quantity-by-product')
    async findSalesQuantityTotalByProduct(
        @Body() dateFilterDTO: DateFilterDTO,
        @Body() productFilterDTO: ProductFilterDTO): Promise<any> {

        return this.consumptionService.findSalesQuantityTotalByProduct(dateFilterDTO, productFilterDTO);
    }

    @Get('/volume-sold-amount-by-product')
    async findSalesAmountTotalByProduct(
        @Body() dateFilterDTO: DateFilterDTO,
        @Body() productFilterDTO: ProductFilterDTO): Promise<any> {

        return this.consumptionService.findSalesAmountTotalByProduct(dateFilterDTO, productFilterDTO);
    }
}
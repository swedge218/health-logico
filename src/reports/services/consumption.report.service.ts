import {ConsumptionReport} from "../domain/model/consumption.report";
import {DateFilterDTO} from "../domain/dto/date-filter.dto";
import {HospitalFilterDTO} from "../domain/dto/hospital-filter.dto";
import {Injectable} from "@nestjs/common";
import {ProductFilterDTO} from "../domain/dto/product-filter.dto";
import {ConsumptionQueryTypeEnum} from "../domain/enums/query.type.enums";

@Injectable()
export class ConsumptionReportService {
    constructor(
        private consumptionReport: ConsumptionReport,
    ) {}


    async findConsumptionByHospitals(dateFilterDTO?: DateFilterDTO, hospitalFilterDTO?: HospitalFilterDTO): Promise<any> {
        return this.consumptionReport.findConsumptionByHospitals(dateFilterDTO, hospitalFilterDTO);
    }

    async findStockReceiptsByHospital(
        dateFilterDTO: DateFilterDTO, hospitalFilterDTO: HospitalFilterDTO): Promise<any> {
        return this.consumptionReport.findStockReceiptsByHospital(dateFilterDTO, hospitalFilterDTO);
    }


    async findSalesQuantityTotalByHospital(
        dateFilterDTO: DateFilterDTO, hospitalFilterDTO: HospitalFilterDTO): Promise<any> {
        return this.consumptionReport.findSalesTotalByHospital(dateFilterDTO, hospitalFilterDTO, ConsumptionQueryTypeEnum.COUNT);
    }


    async findSalesAmountTotalByHospital(
        dateFilterDTO: DateFilterDTO, hospitalFilterDTO: HospitalFilterDTO): Promise<any> {
        return this.consumptionReport.findSalesTotalByHospital(dateFilterDTO, hospitalFilterDTO, ConsumptionQueryTypeEnum.AMOUNT);
    }

    async findSalesQuantityTotalByProduct(
        dateFilterDTO: DateFilterDTO, productFilterDTO: ProductFilterDTO): Promise<any> {
        return this.consumptionReport.findSalesTotalByProduct(dateFilterDTO, productFilterDTO, ConsumptionQueryTypeEnum.COUNT);
    }

    async findSalesAmountTotalByProduct(
        dateFilterDTO: DateFilterDTO, productFilterDTO: ProductFilterDTO): Promise<any> {
        return this.consumptionReport.findSalesTotalByProduct(dateFilterDTO, productFilterDTO, ConsumptionQueryTypeEnum.AMOUNT);
    }
}
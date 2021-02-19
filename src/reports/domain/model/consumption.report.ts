import {Reports} from "./reports";
import {SalesReport} from "./sales.report";
import {StockReceiptReport} from "./stock.receipt.report";
import {DateFilterDTO} from "../dto/date-filter.dto";
import {HospitalFilterDTO} from "../dto/hospital-filter.dto";
import {Visualizations} from "./visualizations";
import {ProductFilterDTO} from "../dto/product-filter.dto";
import {ConsumptionQueryTypeEnum} from "../enums/query.type.enums";

export class ConsumptionReport extends Reports{

    receiptReport: StockReceiptReport;
    salesReport: SalesReport;
    viz: Visualizations;

    constructor() {
        super();
        this.salesReport = new SalesReport();
        this.receiptReport = new StockReceiptReport();
        this.viz = new Visualizations();
    }

    async findConsumptionByHospitals(dateFilterDTO?: DateFilterDTO, hospitalFilterDTO?: HospitalFilterDTO) {
        const promises = [];
        const stockReceipts = () => this.findStockReceiptsByHospital(dateFilterDTO, hospitalFilterDTO);
        const salesTotals = () => this.findSalesTotalByHospital(dateFilterDTO, hospitalFilterDTO, ConsumptionQueryTypeEnum.COUNT)

        promises.push(stockReceipts(), salesTotals());

        return await Promise.all(promises)
            .then(result => {

                const array1 = result[0];
                const array2 = result[1];
                const selector = 'hospital_name';
                const index1 = 'quantity_received';
                const index2 = 'quantity_sold';

                // console.log('arrays', array1, array2);

                return this.viz.makeGroupedBarChartData(result[0], result[1], selector, index1, index2);
            });

    }

    findStockReceiptsByHospital(
        dateFilterDTO?: DateFilterDTO, hospitalFilterDTO?: HospitalFilterDTO) {

        if (dateFilterDTO === undefined) dateFilterDTO = new DateFilterDTO();
        if (hospitalFilterDTO === undefined) hospitalFilterDTO = new HospitalFilterDTO();

        const {startDate, endDate, hasFilter} =
            this.dateFilters.applyWithinMonthDateFilter(dateFilterDTO.month, dateFilterDTO.year);
        const {hospitalId} = this.productFilters.applyHospitalFilter(hospitalFilterDTO.hospital);

        return this.receiptReport.findStockReceiptsByHospital(
            hasFilter, startDate, endDate, hospitalId);
    }

    findSalesTotalByHospital(
        dateFilterDTO?: DateFilterDTO, hospitalFilterDTO?: HospitalFilterDTO, queryType?: number) {

        if (dateFilterDTO === undefined) dateFilterDTO = new DateFilterDTO();
        if (hospitalFilterDTO === undefined) hospitalFilterDTO = new HospitalFilterDTO();

        const {startDate, endDate, hasFilter} =
            this.dateFilters.applyWithinMonthDateFilter(dateFilterDTO.month, dateFilterDTO.year);
        const {hospitalId} = this.productFilters.applyHospitalFilter(hospitalFilterDTO.hospital);

        return this.salesReport.getSalesTotalByHospital(
            hasFilter, startDate, endDate, hospitalId, queryType);
    }

    findSalesTotalByProduct(
        dateFilterDTO?: DateFilterDTO, productFilterDTO?: ProductFilterDTO, queryType?: number) {

        if (dateFilterDTO === undefined) dateFilterDTO = new DateFilterDTO();
        if (productFilterDTO === undefined) productFilterDTO = new ProductFilterDTO();

        const {startDate, endDate, hasFilter} =
            this.dateFilters.applyWithinMonthDateFilter(dateFilterDTO.month, dateFilterDTO.year);
        const {productId} = this.productFilters.applyProductFilter(productFilterDTO.product);

        return this.salesReport.getSalesTotalByProduct(
            hasFilter, startDate, endDate, productId, queryType);
    }
}
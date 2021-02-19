import {Injectable} from "@nestjs/common";
import {Reports} from "./reports";
import {DateFilterDTO} from "../dto/date-filter.dto";
import {ProductFilterDTO} from "../dto/product-filter.dto";
import {PatientReport} from "./patient.report";
import {PrescriptionReport} from "./prescription.report";
import {SalesReport} from "./sales.report";
import {ProductReport} from "./product.report";

@Injectable()
export class HomeReport extends Reports{

    productReport: ProductReport;//
    patientReport: PatientReport;
    prescriptionReport: PrescriptionReport;
    salesReport: SalesReport;

    constructor() {
        super();
        this.productReport = new ProductReport();
        this.patientReport = new PatientReport();
        this.salesReport = new SalesReport();
        this.prescriptionReport = new PrescriptionReport();
    }
    async findHomeDataPoints() {
        const promises = [
            this.findHomeSummaries().then(summary => ({name: 'totals', value: summary})),
            this.findHomeStockData().then(stock => ({name: 'stock', value: stock})),
            this.findSalesQuantityByProductVolumes().then(volumes => (
                {name: 'sales_volumes', value: volumes}))
        ];

        return this.reducer(promises)
            .then(result => {
                return {
                    summary: result["totals"],
                    stock: result['stock'],
                    volumes: result['sales_volumes']
                }
            });
    }

    /**
     **** Filters: month and year ***
     - Total patients enrolled
     - Total sales amount (Naira & USD)
     - Total products sold
     - Confirmed prescriptions
     */
    async findHomeSummaries(dateFilterDTO?: DateFilterDTO) {

        if (dateFilterDTO === undefined) dateFilterDTO = new DateFilterDTO();

        const {startDate, endDate, hasFilter} =
            this.dateFilters.applyWithinMonthDateFilter(dateFilterDTO.month, dateFilterDTO.year);

        const promises = [];
        promises.push(
            this.patientReport.getPatientsCount(hasFilter, startDate, endDate),
            this.prescriptionReport.getPrescriptionsCount(hasFilter, startDate, endDate),
            this.salesReport.getSalesTotal(hasFilter, startDate, endDate),
            this.productReport.getProductsSoldCount(hasFilter, startDate, endDate)
         )

        return this.reducer(promises)
            .then(result => {
                return {
                    patients: result["patients"],
                    prescriptions:  result['prescriptions'],
                    sales_total: result['sales'],
                    products_sold_count: result['products_sold'],
                }
            });
    }


    /**
     Array
     **** Filters: product ***
     - Total stock available by product
     */
    async findHomeStockData (productId?: number) {
        return this.productReport.findProductsStockData(productId);
    }

    /**** Filters: month, year and product ***
     - Total volumes sold by product
     */
    async findSalesQuantityByProductVolumes(
        dateFilterDTO?: DateFilterDTO, productFilterDTO?: ProductFilterDTO) {

        if (dateFilterDTO === undefined) dateFilterDTO = new DateFilterDTO();
        if (productFilterDTO === undefined) productFilterDTO = new ProductFilterDTO();

        const {startDate, endDate, hasFilter} =
            this.dateFilters.applyWithinMonthDateFilter(dateFilterDTO.month, dateFilterDTO.year);
        const {productId} = this.productFilters.applyProductFilter(productFilterDTO.product);

        return this.productReport.findSalesQuantityByProductVolumes(
            hasFilter, startDate, endDate, productId)
    }
}
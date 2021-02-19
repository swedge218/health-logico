import {DateFilterDTO} from "../dto/date-filter.dto";
import {HospitalFilterDTO} from "../dto/hospital-filter.dto";
import {Reports} from "./reports";
import {Functions} from "../../../utils/functions";
import {Stock} from "../../../stock/domain/stock.entity";
import {StockReceiptReport} from "./stock.receipt.report";

export class StockReport extends Reports{
    //Total Products Received by facility from WWHC
    // - Total  Quantity Available
    // - Balance Carried Forward - ??
    // - Frequency Per Day - ??
    // - Number of Requests - ??
    // - Months of Stock on Hand - ??

    async findStockSummaries(dateFilterDTO?: DateFilterDTO, hospitalFilterDTO?: HospitalFilterDTO): Promise<any> {

        const {startDate, endDate, hasFilter} =
            this.dateFilters.applyWithinMonthDateFilter(dateFilterDTO.month, dateFilterDTO.year);
        const {hospitalId} = this.productFilters.applyHospitalFilter(hospitalFilterDTO.hospital);

        const stockAvailable = () => this.getStockAvailable(hospitalId);
        const stockReceipts = () => this.getStockReceiptsByHospital(hasFilter, startDate, endDate, hospitalId);

        const promises = [stockAvailable(), stockReceipts()];

        return this.reducer(promises)
            .then(result => {
                return {
                    stock_available: result["stock_available"],
                    stock_receipts: result['stock_receipts']
                }
            })
    }

    async getStockAvailable(hospitalId: number) {
        const sqb = this.connection.getRepository(Stock)
            .createQueryBuilder('stock')
            .select('quantity')
            .addSelect('product_id', 'product')
            .addSelect('batch_number')
            .addSelect('brand_name', 'product_name')
            .addSelect('hospital_id', 'hospital')
            .addSelect('title', 'hospital_name')
            .leftJoin('stock.hospital', 'hospital_rel')
            .leftJoin('stock.product', 'product_rel')

        // if (Functions.isEmptyValue(hospitalId)) hospitalId = null;
        // if(hospitalId === null) {
        //     sqb.where("hospital_id IS NULL");
        // } else {
        //     sqb.where("hospital_id= :hId", {hId: hospitalId});
        // }

        sqb.groupBy('hospital_id, product_id, batch_number')
        console.log('sql', sqb.getSql());
            return sqb.getRawMany()
            .then(result => {
                return {name: 'stock_available', value: result};
            });
    }

    async getStockReceiptsByHospital(hasFilter: boolean, startDate: Date, endDate: Date, hospitalId: number) {
        const stockReceiptReport = new StockReceiptReport();
        return stockReceiptReport.findStockReceiptsByHospital(hasFilter, startDate, endDate, hospitalId)
            .then(result => {
                return {name: 'stock_receipts', value: result};
            })
    }
}
import {Hospital} from "../../../hospital/domain/hospital.entity";
import {Reports} from "./reports";
import {DateFilterDTO} from "../dto/date-filter.dto";
import {HospitalFilterDTO} from "../dto/hospital-filter.dto";
import {Stock} from "../../../stock/domain/stock.entity";
import {Functions} from "../../../utils/functions";

export class StockReceiptReport extends Reports {

    async findStockReceiptsByHospital(
        hasFilter: boolean, startDate: Date, endDate: Date, hospitalId: number) {

        const sqb = this.connection.getRepository(Hospital)
            .createQueryBuilder("hospital")
            .leftJoinAndSelect("hospital.receipt", "receipts");


            if (!hasFilter) {
                sqb.leftJoinAndSelect("receipts.stockReceiptItems", "receiptItem");
            } else {
                sqb.leftJoinAndSelect("receipts.stockReceiptItems", "receiptItem",
                    'receiptItem.created_at >= :from AND receiptItem.created_at < :to',
                    {from: startDate, to: endDate});
            }

            sqb.leftJoinAndSelect("receiptItem.issueItem", "issueItem")
            .leftJoinAndSelect("issueItem.orderItem", "orderItem")
            .leftJoinAndSelect("orderItem.product", "product")
            .select("hospital.id", "hospital_id")
            .addSelect("hospital.title", "hospital_name")
            .addSelect("SUM(product_id)", "quantity_received");

        if(hospitalId !== undefined) {
            sqb.where("receipts.hospital_id = :hId", {hId: hospitalId});
        }

        sqb.groupBy('hospital.id')
        sqb.orderBy('hospital.id')
        // console.log(sqb.getSql(), startDate, endDate, hospitalId)
        return sqb.getRawMany();
    }


}
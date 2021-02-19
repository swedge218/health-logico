import {Payment} from "../../../payment/domain/payment.entity";
import {PaymentStatusEnum} from "../../../payment/domain/enums/payment-status.enum";
import {Reports} from "./reports";
import {Hospital} from "../../../hospital/domain/hospital.entity";
import {Invoice} from "../../../invoice/domain/invoice.entity";
import {Product} from "../../../product/domain/product.entity";
import {Functions} from "../../../utils/functions";
import {ConsumptionQueryTypeEnum} from "../enums/query.type.enums";
import {DateFunctions} from "../../../utils/date.functions";

export class SalesReport extends Reports{

    getSalesTotal = async (hasFilter: boolean, startDate: Date, endDate: Date): Promise<any> => {
        const sqb = this.connection.getRepository(Payment)
            .createQueryBuilder("payment")
            .select("SUM(paid_amount)", "total")
            .where("status = :status", {status: PaymentStatusEnum.SUCCESSFUL});

        if (hasFilter) {
            sqb.where("payment_date >= :from", {from: startDate});
            sqb.andWhere("payment_date < :to", {to: endDate});
        }

        return sqb.getRawOne().then(sales => ({name: 'sales', value: Number(sales.total)}));
    }

    getSalesTotalByHospital = async (
        hasFilter: boolean, startDate: Date, endDate: Date,
        hospitalId: number, queryType: number): Promise<any> => {

        const {queryTypeField, queryFieldAlias} = this.getQueryFields(queryType);

        const subQuery = this.connection.getRepository(Invoice)
            .createQueryBuilder('invoice')
            .leftJoinAndSelect("invoice.payment", "payment")
            .leftJoinAndSelect("invoice.invoiceItems", "invoiceItems")
            .select("invoice.hospital_id", 'hid')
            .addSelect(`${queryTypeField}`)
            .where('status= :status', {status: PaymentStatusEnum.SUCCESSFUL})

        if (hasFilter) {
            subQuery.andWhere("payment_date >= :from", {from: startDate});
            subQuery.andWhere("payment_date < :to", {to: endDate});
        }


        const sqb = this.connection.getRepository(Hospital)
            .createQueryBuilder("hospital")
            .leftJoinAndSelect("(" + subQuery.getQuery() + ")", 'sales', "hospital.id = sales.hid")
            .select(`SUM(sales.${queryTypeField})`, `${queryFieldAlias}`)
            .addSelect("hospital.id", "hospital_id")
            .addSelect("hospital.title", "hospital_name")
            .setParameters(subQuery.getParameters())

        if(hospitalId !== undefined) {
            sqb.andWhere("hospital.id = :hId", {hId: hospitalId});
        }

        sqb.groupBy('hospital.id')
        sqb.orderBy('hospital.id')
        console.log('sql', sqb.getSql(), startDate, endDate, hospitalId)
        return sqb.getRawMany();
    }

    getSalesTotalByProduct = async (
        hasFilter: boolean, startDate: Date, endDate: Date,
        productId: number, queryType: number): Promise<any> => {

        const {queryTypeField, queryFieldAlias} = this.getQueryFields(queryType);

        const subQuery = this.connection.getRepository(Invoice)
            .createQueryBuilder('invoice')
            .leftJoinAndSelect("invoice.payment", "payment")
            .leftJoinAndSelect("invoice.invoiceItems", "invoiceItems")
            .select("invoiceItems.product_id", 'pid')
            .addSelect(`${queryTypeField}`)
            .addSelect('payment_date')
            .where('status= :status', {status: PaymentStatusEnum.SUCCESSFUL})

        if (hasFilter) {
            subQuery.andWhere("payment_date >= :from", {from: startDate});
            subQuery.andWhere("payment_date < :to", {to: endDate});
        }


        const sqb = this.connection.getRepository(Product)
            .createQueryBuilder("product")
            .leftJoinAndSelect("(" + subQuery.getQuery() + ")", 'sales', "product.id = sales.pid")
            .select(`SUM(sales.${queryTypeField})`, `${queryFieldAlias}`)
            .addSelect('MONTH(sales.payment_date)', 'payment_date')
            .addSelect("product.id", "product_id")
            .addSelect("product.brand_name", "product_name")
            .setParameters(subQuery.getParameters());

        if(productId !== undefined) {
            sqb.andWhere("product.id = :pId", {pId: productId});
        }

        sqb.groupBy('MONTH(payment_date), product.id')
        sqb.orderBy('product.id');
        // console.log('sql', sqb.getSql(), startDate, endDate, productId);

        const rows = await sqb.getRawMany();

        return rows.map((item) => {
             item.payment_date = DateFunctions.monthNumberToString(item.payment_date);
             return item;
        })
    }


    getQueryFields = (queryType: number) => {
        let queryTypeField = '';
        let queryFieldAlias = '';

        switch (queryType) {
            case ConsumptionQueryTypeEnum.COUNT: {
                queryTypeField = 'quantity';
                queryFieldAlias = 'quantity_sold';
                break;
            }
            case ConsumptionQueryTypeEnum.AMOUNT: {
                queryTypeField = 'paid_amount';
                queryFieldAlias = 'amount_sold';
                break;
            }
        }

        return {queryTypeField, queryFieldAlias: queryFieldAlias};
    }
}
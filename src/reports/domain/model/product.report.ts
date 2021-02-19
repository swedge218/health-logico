import {Reports} from "./reports";
import {Product} from "../../../product/domain/product.entity";
import {Invoice} from "../../../invoice/domain/invoice.entity";
import {PaymentStatusEnum} from "../../../payment/domain/enums/payment-status.enum";

export class ProductReport extends Reports {

    getProductsSoldCount = async (
        hasFilter: boolean, startDate: Date, endDate: Date): Promise<any> => {

        const sqb = this.connection.getRepository(Invoice)
            .createQueryBuilder('invoice')
            .leftJoinAndSelect("invoice.payment", "payment")
            .leftJoinAndSelect("invoice.invoiceItems", "invoiceItems")
            .addSelect("SUM(quantity)", "quantity_sum")
            .where('status= :status', {status: PaymentStatusEnum.SUCCESSFUL})

        if (hasFilter) {
            sqb.andWhere("payment_date >= :from", {from: startDate});
            sqb.andWhere("payment_date < :to", {to: endDate});
        }

        return sqb.getRawOne().then(sales => (
                {name: 'products_sold', value: Number(sales.quantity_sum)}));
    }

    async findProductsStockData (productId?: number) {
        const sqb = await this.connection.getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect("product.stock", "stock")
            .select("product.id", "product_id")
            .addSelect("product.brand_name", "product_name")
            .addSelect("SUM(stock.quantity)", "quantity");

        if(productId !== undefined) {
            sqb.where("stock.product_id = :pId", {pId: productId});
        }

        sqb.groupBy('product.id');
        return sqb.getRawMany();
    }

    async findSalesQuantityByProductVolumes(
        hasFilter: boolean, startDate: Date, endDate: Date, productId: number) {

        const sqb = this.connection.getRepository(Product)
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.invoiceItem", "invoiceItems")
            .select("product.id", "product_id")
            .addSelect("product.brand_name", "product_name")
            .addSelect("SUM(quantity)", "quantity");

        if (hasFilter) {
            sqb.where("invoiceItems.created_at >= :from", {from: startDate});
            sqb.andWhere("invoiceItems.created_at < :to", {to: endDate});
        }

        if(productId !== undefined) {
            sqb.where("invoiceItems.product_id = :pId", {pId: productId});
        }

        sqb.groupBy('product.id')
        return sqb.getRawMany();
    }
}
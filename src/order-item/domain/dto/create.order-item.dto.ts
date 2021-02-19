import {Product} from "../../../product/domain/product.entity";
import {Order} from "../../../order/domain/order.entity";
import {IsInt, IsNotEmpty} from "class-validator";

export class CreateOrderItemDTO {

    @IsNotEmpty()
    @IsInt()
    orderedQuantity: number;

    @IsNotEmpty()
    @IsInt()
    product: Product;

    @IsNotEmpty()
    @IsInt()
    order: Order;

}
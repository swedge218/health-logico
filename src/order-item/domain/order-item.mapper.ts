import {CreateOrderItemDTO} from "./dto/create.order-item.dto";
import {OrderItem} from "./order-item.entity";
import {Order} from "../../order/domain/order.entity";
import {Product} from "../../product/domain/product.entity";


export class OrderItemMapper {
    fromDTO(dto: CreateOrderItemDTO):OrderItem {
        const orderItem: OrderItem = new OrderItem();

        orderItem.orderedQuantity = dto.orderedQuantity;
        orderItem.product = dto.product;
        orderItem.order = dto.order;

        return orderItem;
    }

    toDTO(order: Order, product: Product, quantity: number):CreateOrderItemDTO {
        const dto: CreateOrderItemDTO = new CreateOrderItemDTO();

        dto.orderedQuantity = quantity;
        dto.product = product;
        dto.order = order;

        return dto;
    }

}
import {OrderStatus} from "./order-status.entity";
import {CreateOrderStatusDTO} from "./dto/create.order-status.dto";

export class OrderStatusMapper {
    fromDTO(dto: CreateOrderStatusDTO):OrderStatus {
        const orderStatus: OrderStatus = new OrderStatus();

        orderStatus.title = dto.title;
        orderStatus.alias = dto.alias;
        orderStatus.sortOrder = dto.sortOrder;

        return orderStatus;
    }
}
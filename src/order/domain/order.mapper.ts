import {Order} from "./order.entity";
import {CreateOrderDTO} from "./dto/create.order.dto";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {User} from "../../user/domain/user.entity";
import {OrderStatus} from "../../order-status/domain/order-status.entity";

export class OrderMapper {
    fromDTO(dto: CreateOrderDTO):Order {
        const order: Order = new Order();

        order.hospital = dto.hospital;
        order.processingOfficer = dto.processingOfficer;
        order.status = dto.status;

        return order;
    }

    toDTO(hospital: Hospital, processingOfficer: User, status: OrderStatus): CreateOrderDTO{
        const dto: CreateOrderDTO = new CreateOrderDTO();

        dto.hospital = hospital;
        dto.processingOfficer = processingOfficer;
        dto.status = status;

        return dto;
    }

    fromValues(hospital: Hospital, processingOfficer: User, status: OrderStatus): Order{
        const order: Order = new Order();

        order.hospital = hospital;
        order.processingOfficer = processingOfficer;
        order.status = status;

        return order;
    }
}
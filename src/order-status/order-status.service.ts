import { Injectable } from '@nestjs/common';
import {OrderStatusModel} from "./domain/order-status.model";
import {OrderStatus} from "./domain/order-status.entity";
import {CreateOrderStatusDTO} from "./domain/dto/create.order-status.dto";

@Injectable()
export class OrderStatusService {
    constructor(
        private orderStatusModel: OrderStatusModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.orderStatusModel.findAll(options);
    }

    async findOne(id: number): Promise<OrderStatus> {
        return this.orderStatusModel.findOne(id);
    }

    async create(createOrderStatusDTO: CreateOrderStatusDTO): Promise<OrderStatus> {
        return this.orderStatusModel.save(createOrderStatusDTO);
    }

    async update(id: number, createOrderStatusDTO: CreateOrderStatusDTO): Promise<OrderStatus> {
        return this.orderStatusModel.update(id,  createOrderStatusDTO);
    }

    async remove(id: number): Promise<any> {
        return this.orderStatusModel.remove(id);
    }
}

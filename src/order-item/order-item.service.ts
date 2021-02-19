import { Injectable } from '@nestjs/common';
import {OrderItemModel} from "./domain/order-item.model";
import {OrderItem} from "./domain/order-item.entity";
import {CreateOrderItemDTO} from "./domain/dto/create.order-item.dto";

@Injectable()
export class OrderItemService {
    constructor(private orderItemModel: OrderItemModel) {}

    async findAll(options: any): Promise<any[]> {
        return this.orderItemModel.findAll(options);
    }

    async findOne(id: number): Promise<OrderItem> {
        return this.orderItemModel.findOne(id);
    }

    async findProduct(id: number): Promise<any> {
        return this.orderItemModel.findProduct(id);
    }

    async create(createOrderItemDTO: CreateOrderItemDTO): Promise<OrderItem> {
        return this.orderItemModel.save(createOrderItemDTO);
    }

    async update(id: number, createOrderItemDTO: CreateOrderItemDTO): Promise<OrderItem> {
        return this.orderItemModel.update(id,  createOrderItemDTO);
    }

    async remove(id: number): Promise<any> {
        return this.orderItemModel.remove(id);
    }
}

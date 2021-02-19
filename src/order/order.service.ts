import { Injectable } from '@nestjs/common';
import {OrderModel} from "./domain/order.model";
import {Order} from "./domain/order.entity";
import {CreateOrderDTO} from "./domain/dto/create.order.dto";
import {OrderNotificationsImpl} from "./domain/notifications/order-notifications.impl";

@Injectable()
export class OrderService {
    constructor(
        private orderModel: OrderModel,
        private orderNotfImpl: OrderNotificationsImpl
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.orderModel.findAll(options);
    }


    async findOne(id: number): Promise<Order> {
        return this.orderModel.findOne(id);
    }

    async findRelated(id: number): Promise<Order> {
        return this.orderModel.findRelatedData(id);
    }

    async create(createOrderDTO: CreateOrderDTO): Promise<Order> {
        return this.orderModel.saveTransaction(createOrderDTO)
            .then(order => {
                this.orderNotfImpl.sendNewOrderNotifications(order);
                return order;
            })
    }

    async update(id: number, createOrderDTO: CreateOrderDTO): Promise<Order> {
        return this.orderModel.update(id,  createOrderDTO);
    }

    async remove(id: number): Promise<any> {
        return this.orderModel.remove(id);
    }
}

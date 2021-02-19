import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {OrderModel} from "./domain/order.model";
import {OrderStatusModule} from "../order-status/order-status.module";
import {OrderItemModule} from "../order-item/order-item.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./domain/order.entity";
import {User} from "../user/domain/user.entity";
import {OrderStatus} from "../order-status/domain/order-status.entity";
import {Hospital} from "../hospital/domain/hospital.entity";
import {OrderNotificationsImpl} from "./domain/notifications/order-notifications.impl";
import {NotificationModule} from "../notification/notification.module";

@Module({
    imports: [
        User,
        OrderStatus,
        OrderStatusModule,
        OrderItemModule,
        Hospital,
        NotificationModule,
        TypeOrmModule.forFeature([Order])
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderModel, OrderNotificationsImpl],
    exports: [OrderModel]
})
export class OrderModule {}

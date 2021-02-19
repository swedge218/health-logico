import { Module } from '@nestjs/common';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrderItem} from "./domain/order-item.entity";
import {Product} from "../product/domain/product.entity";
import {Order} from "../order/domain/order.entity";
import {OrderItemModel} from "./domain/order-item.model";

@Module({
    imports: [Product, Order, TypeOrmModule.forFeature([OrderItem])],
    controllers: [OrderItemController],
    providers: [OrderItemService, OrderItemModel],
    exports: [OrderItemService, OrderItemModel]
})
export class OrderItemModule {}

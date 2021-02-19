import { Module } from '@nestjs/common';
import { OrderStatusController } from './order-status.controller';
import { OrderStatusService } from './order-status.service';
import {OrderStatusModel} from "./domain/order-status.model";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrderStatus} from "./domain/order-status.entity";

@Module({
    imports: [TypeOrmModule.forFeature([OrderStatus])],
    controllers: [OrderStatusController],
    providers: [OrderStatusService, OrderStatusModel],
    exports: [OrderStatusModel]
})
export class OrderStatusModule {}

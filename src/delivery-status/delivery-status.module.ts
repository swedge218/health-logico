import { Module } from '@nestjs/common';
import {DeliveryStatusController} from "./delivery-status.controller";
import {DeliveryStatusService} from "./delivery-status.service";
import {DeliveryStatus} from "./domain/delivery-status.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DeliveryStatusModel} from "./domain/delivery-status.model";


@Module({
    imports: [TypeOrmModule.forFeature([DeliveryStatus])],
    controllers: [DeliveryStatusController],
    providers: [DeliveryStatusService, DeliveryStatusModel],
    exports: [DeliveryStatusService]
})
export class DeliveryStatusModule {}
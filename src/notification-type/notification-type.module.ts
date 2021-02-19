import { Module } from '@nestjs/common';
import { NotificationTypeController } from './notification-type.controller';
import { NotificationTypeService } from './notification-type.service';
import {NotificationTypeModel} from "./domain/notification-type.model";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Patient} from "../patient/domain/patient.entity";
import {Prescription} from "../prescription/domain/prescription.entity";
import {NotificationType} from "./domain/notification-type.entity";

@Module({
    imports: [Patient, TypeOrmModule.forFeature([NotificationType])],
    controllers: [NotificationTypeController],
    providers: [NotificationTypeService, NotificationTypeModel]
})
export class NotificationTypeModule {}

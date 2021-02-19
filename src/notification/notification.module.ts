import { Module } from '@nestjs/common';
import {Notification} from "./domain/notification.entity";
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {NotificationModel} from "./domain/notification.model";

@Module({
    imports: [TypeOrmModule.forFeature([Notification])],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationModel],
    exports: [NotificationService]
})
export class NotificationModule {}
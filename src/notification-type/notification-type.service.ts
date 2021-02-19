import { Injectable } from '@nestjs/common';
import {NotificationTypeModel} from "./domain/notification-type.model";
import {NotificationType} from "./domain/notification-type.entity";
import {CreateNotificationTypeDTO} from "./domain/dto/create-notification-type.dto";

@Injectable()
export class NotificationTypeService {
    constructor(
        private notificationTypeModel: NotificationTypeModel,
    ) {}

    async findAll(): Promise<NotificationType[]> {
        return this.notificationTypeModel.findAll();
    }

    async findOne(id: number): Promise<NotificationType> {
        return this.notificationTypeModel.findOne(id);
    }

    async create(createNotificationTypeDTO: CreateNotificationTypeDTO): Promise<NotificationType> {
        return this.notificationTypeModel.save(createNotificationTypeDTO);
    }

    async update(id: number, createNotificationTypeDTO: CreateNotificationTypeDTO): Promise<NotificationType> {
        return this.notificationTypeModel.update(id,  createNotificationTypeDTO);
    }

    async remove(id: number): Promise<any> {
        return this.notificationTypeModel.remove(id);
    }
}

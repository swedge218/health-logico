import { Injectable } from '@nestjs/common';
import {NotificationModel} from "./domain/notification.model";
import {Notification} from "../notification/domain/notification.entity";
import {CreateNotificationDTO} from "./domain/dto/create-notification.dto";
import {UpdateNotificationDTO} from "./domain/dto/update-notification.dto";

@Injectable()
export class NotificationService {
    constructor(private notificationModel: NotificationModel) {}

    async findAll(): Promise<Notification[]> {
        return this.notificationModel.findAll();
    }

    async findOne(id: number): Promise<Notification> {
        return this.notificationModel.findOne(id);
    }

    async create(createNotificationDTO: CreateNotificationDTO): Promise<Notification> {
        return this.notificationModel.save(createNotificationDTO);
    }

    async update(id: number, updateNotificationDTO: UpdateNotificationDTO): Promise<Notification> {
        return this.notificationModel.update(id,  updateNotificationDTO);
    }

    async remove(id: number): Promise<any> {
        return this.notificationModel.remove(id);
    }
}

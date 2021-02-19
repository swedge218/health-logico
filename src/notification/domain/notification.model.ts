import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Notification} from "./notification.entity";
import {CreateNotificationDTO} from "./dto/create-notification.dto";
import {NotificationMapper} from "./notification.mapper";
import { UpdateResult } from  'typeorm';
import {UpdateNotificationDTO} from "./dto/update-notification.dto";

@Injectable()
export class NotificationModel{
    constructor(
        @InjectRepository(Notification)
        private readonly repository: Repository<Notification>
    ) {}

    async findAll(): Promise<Notification[]> {
        return this.repository.find();
    }

    async findOne(id: number): Promise<Notification> {
        return this.repository.findOne(id);
    }

    async save(createNotificationDTO: CreateNotificationDTO): Promise<Notification> {
        //ntype, remoteid
        //service - collect object, impl mapper into notif,
        const notification: Notification = new NotificationMapper().fromDTO(createNotificationDTO);
        return this.repository.save(notification)
            .then(notification => notification)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, updateNotificationDTO: UpdateNotificationDTO): Promise<Notification> {
        let notification: Notification = await this.findOne(id);
        notification.viewed = updateNotificationDTO.viewed;

        return this.repository.update(id,  notification)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }
}
import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {NotificationType} from "./notification-type.entity";
import {CreateNotificationTypeDTO} from "./dto/create-notification-type.dto";
import {NotificationTypeMapper} from "./notification-type.mapper";

@Injectable()
export class NotificationTypeModel {
    constructor(
        @InjectRepository(NotificationType)
        private readonly repository: Repository<NotificationType>
    ) {}

    async findAll(): Promise<NotificationType[]> {
        return this.repository.find();
    }

    async findOne(id: number): Promise<NotificationType> {
        return this.repository.findOne(id);
    }

    async save(createNotificationTypeDTO: CreateNotificationTypeDTO): Promise<NotificationType> {
        const notificationType: NotificationType = new NotificationTypeMapper().fromDTO(createNotificationTypeDTO);
        return this.repository.save(notificationType)
            .then(notificationType => notificationType)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createNotificationTypeDTO: CreateNotificationTypeDTO): Promise<NotificationType> {
        const notificationType: NotificationType = new NotificationTypeMapper().fromDTO(createNotificationTypeDTO);
        return this.repository.update(id,  notificationType)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
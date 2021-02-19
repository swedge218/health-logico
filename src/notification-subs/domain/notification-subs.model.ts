import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {NotificationSubs} from "./notification-subs.entity";
import {CreateNotificationSubsDTO} from "./dto/create-notification-subs.dto";
import {NotificationSubsMapper} from "./notification-subs.mapper";

@Injectable()
export class NotificationSubsModel {
    constructor(
        @InjectRepository(NotificationSubs)
        private readonly repository: Repository<NotificationSubs>
    ) {}

    async findAll(): Promise<NotificationSubs[]> {
        return this.repository.find();
    }

    async findOne(id: number): Promise<NotificationSubs> {
        return this.repository.findOne(id);
    }

    async save(createNotificationSubsDTO: CreateNotificationSubsDTO): Promise<NotificationSubs> {
        const notificationSubs: NotificationSubs = new NotificationSubsMapper().fromDTO(createNotificationSubsDTO);
        return this.repository.save(notificationSubs)
            .then(notificationSubs => notificationSubs)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createNotificationSubsDTO: CreateNotificationSubsDTO): Promise<NotificationSubs> {
        const notificationSubs: NotificationSubs = new NotificationSubsMapper().fromDTO(createNotificationSubsDTO);
        return this.repository.update(id,  notificationSubs)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
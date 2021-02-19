import {CreateNotificationSubsDTO} from "./dto/create-notification-subs.dto";
import {NotificationSubs} from "./notification-subs.entity";

export class NotificationSubsMapper{
    fromDTO(dto: CreateNotificationSubsDTO): NotificationSubs {
        const notificationSubs: NotificationSubs = new NotificationSubs();

        notificationSubs.role = dto.role;
        notificationSubs.notificationType = dto.notificationType;

        return notificationSubs;
    }
}
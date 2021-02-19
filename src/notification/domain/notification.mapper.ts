import {Notification} from "./notification.entity";
import {CreateNotificationDTO} from "./dto/create-notification.dto";

export class NotificationMapper {
    fromDTO(dto: CreateNotificationDTO): Notification {
        const notification: Notification = new Notification();

        notification.actionUrl = dto.actionUrl;
        notification.description = dto.description;
        notification.title = dto.title;
        notification.viewed = dto.viewed;
        notification.notifcationType = dto.notifcationType;
        notification.remoteId = dto.remoteId;

        return notification;
    }
}
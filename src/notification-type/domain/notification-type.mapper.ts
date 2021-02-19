import {CreateNotificationTypeDTO} from "./dto/create-notification-type.dto";
import {NotificationType} from "./notification-type.entity";


export class NotificationTypeMapper{
    fromDTO(dto: CreateNotificationTypeDTO): NotificationType {
        const notfType: NotificationType = new NotificationType();

        notfType.title = dto.title;
        notfType.alias = dto.alias;
        notfType.category = dto.category;

        return notfType;
    }
}
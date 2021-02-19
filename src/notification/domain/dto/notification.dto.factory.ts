import {CreateNotificationDTO} from "./create-notification.dto";
import {
    ORDER_NOTIFICATION_DESCRIPTION,
    ORDER_NOTIFICATION_TITLE, ORDER_NOTIFICATION_TYPE_NAME
} from "../../../order/domain/constants/order.constants";

export class NotificationDTOFactory {

    makeDTO(
        actionUrl: string,
        description: string,
        title: string,
        viewed: number,
        notifcationType: string,
        remoteId: number
    ){
        const dto: CreateNotificationDTO = new CreateNotificationDTO();

        dto.actionUrl = actionUrl;
        dto.description = description;
        dto.title = title;
        dto.viewed = viewed;
        dto.notifcationType = notifcationType;
        dto.remoteId = remoteId;

        return dto;
    }
}
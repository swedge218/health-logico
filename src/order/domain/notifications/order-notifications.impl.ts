import {INotifier} from "../../../notification/domain/impl/inotifier.interface";
import {CreateNotificationDTO} from "../../../notification/domain/dto/create-notification.dto";
import {INotificationInsertData} from "../../../notification/domain/impl/notification-insert-data.interface";
import {
    ORDER_NOTIFICATION_DESCRIPTION,
    ORDER_NOTIFICATION_TITLE,
    ORDER_NOTIFICATION_TYPE_NAME
} from "../constants/order.constants";
import {NotificationService} from "../../../notification/notification.service";
import {Injectable} from "@nestjs/common";
import {NotificationDTOFactory} from "../../../notification/domain/dto/notification.dto.factory";
import {Order} from "../order.entity";

@Injectable()
export class OrderNotificationsImpl implements INotifier{

    constructor(private notificationService: NotificationService){};

    setUpCreateNotificationDTO(orderId: number): CreateNotificationDTO {
        const dtoFactory: NotificationDTOFactory = new NotificationDTOFactory();

        return dtoFactory.makeDTO(
            "order/" + orderId,
            ORDER_NOTIFICATION_DESCRIPTION,
            ORDER_NOTIFICATION_TITLE,
            0,
            ORDER_NOTIFICATION_TYPE_NAME,
            orderId
        );
    }

    // setUpUpdateNotificationDTO(orderId: number): CreateNotificationDTO {
    //     const dtoFactory: NotificationDTOFactory = new NotificationDTOFactory();
    //
    //     return dtoFactory.makeDTO(
    //         "order/" + orderId,
    //         ORDER_NOTIFICATION_DESCRIPTION,
    //         ORDER_NOTIFICATION_TITLE,
    //         0,
    //         ORDER_NOTIFICATION_TYPE_NAME,
    //         orderId
    //     );
    // }

    async sendNewOrderNotifications(order: Order) {
        this.sendSystemNotification(order);
        this.sendEmailNotification(order);
    }

    async sendSystemNotification(order: Order) {
        const dto: CreateNotificationDTO = this.setUpCreateNotificationDTO(order.id);
        this.notificationService.create(dto);
    }

    async sendEmailNotification(order: Order) {
        //get the recipients
        //send emails in loop
    }
    //location, role and user
}
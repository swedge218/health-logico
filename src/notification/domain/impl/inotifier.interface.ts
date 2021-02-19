import {CreateNotificationDTO} from "../dto/create-notification.dto";
import {INotificationInsertData} from "./notification-insert-data.interface";

export interface INotifier{
    setUpCreateNotificationDTO(orderId: number): CreateNotificationDTO;
    // setUpUpdateNotificationDTO(orderId: number, notfId: number): CreateNotificationDTO;
}
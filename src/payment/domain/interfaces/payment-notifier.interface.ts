import {Payment} from "../payment.entity";
import {NIBSSNotificationDTO} from "../dto/nibss-notification.dto";

export interface IPaymentNotifier {
    notify(payment: Payment, dto: any): Promise<any>;
}
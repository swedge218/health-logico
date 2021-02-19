import {Payment} from "./payment.entity";
import {NIBSSNotificationDTO} from "./dto/nibss-notification.dto";
import {PaymentMapper} from "./payment.mapper";
import {PaymentStatusEnum} from "./enums/payment-status.enum";
import {HttpStatus, InternalServerErrorException} from "@nestjs/common";
import {ALREADY_DONE_TEXT, NOTFOUND_TEXT, UNDERPAYMENT_TEXT} from "./constants/payment.constants";
import {IPaymentNotifier} from "./interfaces/payment-notifier.interface";
import {PaymentModel} from "./payment.model";
import {DateFunctions} from "../../utils/date.functions";

export class NIBSSPaymentModel extends PaymentModel implements IPaymentNotifier {

    async notify(payment: Payment, nibssNotificationDTO: NIBSSNotificationDTO): Promise<any> {
        const paymentMapper: PaymentMapper = new PaymentMapper();
        if(payment.status !== PaymentStatusEnum.PENDING) {
            return paymentMapper.toPaymentNotfResponseDTO(
                HttpStatus.UNPROCESSABLE_ENTITY,
                PaymentStatusEnum.ALREADY_DONE,
                ALREADY_DONE_TEXT
            );
        }

        if(payment.invoiceAmount > nibssNotificationDTO.amount) {
            return paymentMapper.toPaymentNotfResponseDTO(
                HttpStatus.UNPROCESSABLE_ENTITY,
                PaymentStatusEnum.PENDING,
                UNDERPAYMENT_TEXT
            )
        }

        // set notification values into payment object
        payment = paymentMapper.fromNIBSSNotificationDTO(payment, nibssNotificationDTO);
        payment.paymentDate = DateFunctions.formatToDBDate(new Date());

        return this.repository.save(payment)
            .then(async () => {
                return this.updateStock(payment.invoice.id);
            }).then(() => {
                return paymentMapper.toPaymentNotfResponseDTO(
                    HttpStatus.NO_CONTENT,
                    PaymentStatusEnum.SUCCESSFUL,
                )
            }).catch((e) => {
                throw new InternalServerErrorException(e)
            })

    }

    returnNotFoundStatus(): any {
        return new PaymentMapper().toPaymentNotfResponseDTO(
            HttpStatus.NOT_FOUND,
            PaymentStatusEnum.NOT_FOUND,
            NOTFOUND_TEXT
        )
    }
}
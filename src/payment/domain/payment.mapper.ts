import {CreatePaymentDTO} from "./dto/create-payment.dto";
import {Payment} from "./payment.entity";
import {PaymentStatusEnum} from "./enums/payment-status.enum";
import {NIBSSNotificationDTO} from "./dto/nibss-notification.dto";
import {PaymentNotificationResponseDTO} from "./dto/payment-notification-response.dto";
import {PaymentChannelsEnum} from "./enums/payment-channels.enum";
import {PayclusterNotificationDTO} from "./dto/paycluster-notification.dto";
import {PayclusterNotificationResponseDTO} from "./dto/paycluster-notification-response.dto";

export class PaymentMapper {
    fromDTO(dto: CreatePaymentDTO): Payment {
        const payment: Payment = new Payment();

        payment.invoiceNumber = dto.invoiceNumber;
        payment.invoiceAmount = dto.amount;
        payment.currency = dto.currency;
        payment.type = dto.type;
        payment.transactionReference = dto.transactionReference;
        payment.maskedPAN = dto.maskedPAN;
        payment.cardScheme = dto.cardScheme;
        payment.customerName = dto.customerName;
        payment.statusCode = dto.statusCode;
        payment.statusDescription = dto.statusDescription;
        payment.retrievalReferenceNumber = dto.retrievalReferenceNumber;
        payment.paymentDate = dto.paymentDate;
        payment.status = dto.status;
        payment.channel = dto.channel;

        return payment;
    }

    fromNIBSSNotificationDTO(payment: Payment, dto: NIBSSNotificationDTO): Payment{
        payment.paidAmount = dto.amount;
        payment.retrievalReferenceNumber = dto.referenceId;
        payment.channel = PaymentChannelsEnum.NIBSS;
        payment.status = PaymentStatusEnum.SUCCESSFUL;
        return payment;
    }

    fromPayclusterNotificationDTO(payment: Payment, dto: PayclusterNotificationDTO): Payment{
        payment.paidAmount = Number(dto.Amount);
        payment.currency = dto.Currency;
        payment.type = dto.Type;
        payment.transactionReference = dto.TransactionRefrence;
        payment.maskedPAN = dto.MaskedPAN;
        payment.cardScheme = dto.CardScheme;
        payment.customerName = dto.CustomerName;
        payment.retrievalReferenceNumber = dto.Reference;
        payment.statusCode = dto.StatusCode;
        payment.statusDescription = dto.StatusDescription;
        payment.paymentDate = dto.PaymentDate;
        payment.channel = PaymentChannelsEnum.PAYCLUSTER;
        payment.status = PaymentStatusEnum.SUCCESSFUL;

        return payment;
    }


    toDTO(invoiceNumber: string, amount: number, status: PaymentStatusEnum): CreatePaymentDTO {
        const dto: CreatePaymentDTO = new CreatePaymentDTO();

        dto.invoiceNumber = invoiceNumber;
        dto.amount = amount;
        dto.status = status;

        return dto;
    }


    toPaymentNotfResponseDTO(statusCode: number, status: string, message?: string): PaymentNotificationResponseDTO {
        const dto: PaymentNotificationResponseDTO = new PaymentNotificationResponseDTO();

        dto.statusCode = statusCode;
        dto.status = status;
        dto.message = message;

        return dto;
    }

    toPayclusterNotfResponseDTO(statusCode: number,
                                invoiceNumber: string): PayclusterNotificationResponseDTO {

        const dto: PayclusterNotificationResponseDTO = new PayclusterNotificationResponseDTO();
        dto.BillerReference = invoiceNumber;
        dto.statusCode = statusCode;
        return dto;
    }
}
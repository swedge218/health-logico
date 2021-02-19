import {Payment} from "./payment.entity";
import {PaymentMapper} from "./payment.mapper";
import {PaymentStatusEnum} from "./enums/payment-status.enum";
import {HttpStatus, InternalServerErrorException} from "@nestjs/common";
import {ALREADY_DONE_TEXT, NOTFOUND_TEXT, UNDERPAYMENT_TEXT} from "./constants/payment.constants";
import {PaymentModel} from "./payment.model";
import {PayclusterNotificationDTO} from "./dto/paycluster-notification.dto";
import {IPaymentNotifier} from "./interfaces/payment-notifier.interface";
import {Connection, getConnection} from "typeorm";


export class PayclusterPaymentModel extends PaymentModel implements IPaymentNotifier {
    async notify(payment: Payment,
                 payclusterNotificationDTO: PayclusterNotificationDTO): Promise<any> {

        const paymentMapper: PaymentMapper = new PaymentMapper();

        if(payment.status == PaymentStatusEnum.SUCCESSFUL) {
            return paymentMapper.toPaymentNotfResponseDTO(
                HttpStatus.CONFLICT,
                PaymentStatusEnum.ALREADY_DONE,
                ALREADY_DONE_TEXT
            );
        }

        if(payment.invoiceAmount > Number(payclusterNotificationDTO.Amount)) {
            return paymentMapper.toPaymentNotfResponseDTO(
                HttpStatus.UNPROCESSABLE_ENTITY,
                PaymentStatusEnum.PENDING,
                UNDERPAYMENT_TEXT
            )
        }

        // set notification values into payment object
        payment = paymentMapper.fromPayclusterNotificationDTO(payment, payclusterNotificationDTO);

        // const connection: Connection = await this.createConnection();
        // const queryRunner = connection.createQueryRunner();
        // await queryRunner.connect();
        // await queryRunner.startTransaction();


        return this.repository.save(payment)
            .then(async () => {
                return this.updateStock(payment.invoice.id);
            }).then(async () => {
                // await queryRunner.commitTransaction();
                return paymentMapper.toPayclusterNotfResponseDTO(
                    HttpStatus.OK,
                    payment.invoiceNumber
                )
            }).catch(async (e) => {
                // await queryRunner.rollbackTransaction();
                throw new InternalServerErrorException(e)
            })
    }

    returnNotFoundStatus(): any {
        return new PaymentMapper().toPaymentNotfResponseDTO(
            HttpStatus.UNPROCESSABLE_ENTITY,
            PaymentStatusEnum.NOT_FOUND,
            NOTFOUND_TEXT
        )
    }

    async createConnection(): Promise<Connection> {
        return getConnection();
    }
}
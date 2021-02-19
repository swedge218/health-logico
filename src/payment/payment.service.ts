import { Injectable } from '@nestjs/common';
import { CreatePaymentDTO } from './domain/dto/create-payment.dto';
import { Payment } from './domain/payment.entity';
import {PaymentModel} from "./domain/payment.model";
import {NIBSSNotificationDTO} from "./domain/dto/nibss-notification.dto";
import {NIBSSPaymentModel} from "./domain/nibbs-payment.model";
import {PayclusterNotificationDTO} from "./domain/dto/paycluster-notification.dto";
import {PayclusterPaymentModel} from "./domain/paycluster-payment.model";
import {ResponseBuilder} from "../utils/ResponseBuilder";

@Injectable()
export class PaymentService {

    constructor (
        private paymentModel: PaymentModel,
        private nibssPaymentModel: NIBSSPaymentModel,
        private payclusterPaymentModel: PayclusterPaymentModel
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.paymentModel.findAll(options);
    }

    async findOne(id: number): Promise<Payment> {
        return this.paymentModel.findOne(id)
    }

    async findStatus(invoiceNumber: string): Promise<Payment> {
        return this.paymentModel.findStatus(invoiceNumber);
    }

    async findByInvoiceNumber(invoiceNumber: string): Promise<Payment> {
        return this.paymentModel.findByInvoiceNumber(invoiceNumber)
    }

    async create(createPaymentDTO: CreatePaymentDTO): Promise<Payment> {
        return this.paymentModel.save(createPaymentDTO);
    }

    async update(id: number, createPaymentDTO: CreatePaymentDTO): Promise<Payment> {
        return this.paymentModel.update(id,  createPaymentDTO);
    }

    async notifyNIBSS(nibssNotificationDTO: NIBSSNotificationDTO): Promise<any> {
        return this.paymentModel.findByInvoiceNumber(nibssNotificationDTO.orderId)
            .then(payment => {
                if(payment == undefined) {
                    return this.nibssPaymentModel.returnNotFoundStatus();
                }
                return this.nibssPaymentModel.notify(payment, nibssNotificationDTO);
            })
    }

    async notifyPayCluster(payclusterNotificationDTO: PayclusterNotificationDTO): Promise<any> {
        return this.paymentModel.findByInvoiceNumber(payclusterNotificationDTO.Reference)
            .then(payment => {
                if(payment == undefined) {
                    return this.nibssPaymentModel.returnNotFoundStatus();
                }
                return this.payclusterPaymentModel.notify(payment, payclusterNotificationDTO);
            })
    }
}
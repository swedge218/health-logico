import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {PaymentStatusEnum} from "../enums/payment-status.enum";


export class CreatePaymentDTO {
    @IsNotEmpty()
    @IsString()
    invoiceNumber: string;

    @IsOptional()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    currency: string;

    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    transactionReference: string;

    @IsOptional()
    @IsString()
    maskedPAN: string;

    @IsOptional()
    @IsString()
    cardScheme: string;

    @IsOptional()
    @IsString()
    customerName: string;

    @IsOptional()
    @IsString()
    statusCode: string;

    @IsOptional()
    @IsString()
    statusDescription: string;

    @IsOptional()
    @IsString()
    retrievalReferenceNumber: string;

    @IsOptional()
    @IsString()
    paymentDate: string;

    @IsNotEmpty()
    @IsString()
    status: PaymentStatusEnum;

    @IsOptional()
    @IsString()
    channel: string;
}
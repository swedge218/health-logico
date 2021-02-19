import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class PayclusterNotificationDTO {
    @IsNotEmpty()
    @IsString()
    Reference: string;

    @IsNotEmpty()
    @IsString()
    Amount: string;

    @IsNotEmpty()
    @IsString()
    Currency: string;

    @IsNotEmpty()
    @IsString()
    Type: string;

    @IsNotEmpty()
    @IsString()
    TransactionRefrence: string;

    @IsNotEmpty()
    @IsString()
    MaskedPAN: string;

    @IsNotEmpty()
    @IsString()
    CardScheme: string;

    @IsNotEmpty()
    @IsString()
    CustomerName: string;

    @IsNotEmpty()
    @IsString()
    StatusCode: string;

    @IsNotEmpty()
    @IsString()
    RetrievalReferenceNumber: string;

    @IsNotEmpty()
    @IsString()
    StatusDescription: string;

    @IsNotEmpty()
    @IsString()
    PaymentDate: string;
}
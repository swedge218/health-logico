import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class PaymentNotificationResponseDTO {
    @IsNotEmpty()
    @IsNumber()
    statusCode: number;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}
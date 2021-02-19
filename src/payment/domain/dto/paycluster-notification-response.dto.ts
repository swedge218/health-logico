import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class PayclusterNotificationResponseDTO {
    @IsNotEmpty()
    @IsNumber()
    statusCode: number;

    @IsNotEmpty()
    @IsString()
    BillerReference: string;
}
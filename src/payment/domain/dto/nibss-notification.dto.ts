import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class NIBSSNotificationDTO {
    @IsNotEmpty()
    @IsString()
    orderId: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    referenceId: string;
}
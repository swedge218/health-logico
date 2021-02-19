import {IsNotEmpty, MinLength, IsString, IsInt, IsNumber, IsOptional, IsArray} from 'class-validator';
import {DeliveryStatus} from "../../../delivery-status/domain/delivery-status.entity";
import {User} from "../../../user/domain/user.entity";

export class CreateProcurementDTO {

    // @IsNotEmpty()
    // @IsString()
    // dateDispatched: string;

    @IsNotEmpty()
    @IsString()
    dateReceived: string;

    @IsString()
    remarks: string;

    @IsNotEmpty()
    @IsNumber()
    deliveryStatus: DeliveryStatus;

    @IsNotEmpty()
    @IsNumber()
    processingOfficer: User;

    @IsOptional()
    @IsArray()
    items: JSON[]
}
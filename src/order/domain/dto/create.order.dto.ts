import {IsArray, IsNumber, IsOptional} from 'class-validator';
import {Hospital} from "../../../hospital/domain/hospital.entity";
import {User} from "../../../user/domain/user.entity";
import {OrderStatus} from "../../../order-status/domain/order-status.entity";

export class CreateOrderDTO {

    @IsNumber()
    hospital: Hospital;

    @IsNumber()
    processingOfficer: User;

    @IsNumber()
    status: OrderStatus;

    @IsOptional()
    @IsArray()
    items: JSON[]
}
import {JoinColumn, ManyToOne} from "typeorm";
import {Hospital} from "../../../hospital/domain/hospital.entity";
import {User} from "../../../user/domain/user.entity";
import {IsArray, IsEmpty, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Order} from "../../../order/domain/order.entity";

export class CreateStockIssueDTO {
    @IsNotEmpty()
    @IsString()
    issueDate: string;

    @IsNotEmpty()
    @IsNumber()
    order: Order;

    @IsNotEmpty()
    @IsNumber()
    issuingOfficer: User;

    @IsNotEmpty()
    @IsNumber()
    issueType: number;

    @IsOptional()
    @IsArray()
    items: JSON[];

    //"items": [{"orderItem": "a", "quantityIssued": 1}]
}
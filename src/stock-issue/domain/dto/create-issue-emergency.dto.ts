import {JoinColumn, ManyToOne} from "typeorm";
import {Hospital} from "../../../hospital/domain/hospital.entity";
import {User} from "../../../user/domain/user.entity";
import {IsArray, IsEmpty, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateEmergencyStockIssueDTO {

    @IsNotEmpty()
    @IsString()
    issueDate: string;

    @IsNotEmpty()
    @IsNumber()
    hospital: Hospital;

    @IsNotEmpty()
    @IsNumber()
    issuingOfficer: User;

    @IsNotEmpty()
    @IsNumber()
    issueType: number;

    @IsOptional()
    @IsArray()
    items: any;

    //"items": [{"product": "a", "quantity": 1}]
}
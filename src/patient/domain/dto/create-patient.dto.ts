import {Column, JoinColumn, ManyToOne} from "typeorm";
import {CancerStage} from "../../../cancer-stage/domain/cancer-stage.entity";
import {CancerType} from "../../../cancer-type/domain/cancer-type.entity";
import {IsDate, IsEmail, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Location} from "../../../location/domain/location.entity";

export class CreatePatientDTO {
    @IsNotEmpty()
    @IsString()
    dateOfBirth:string;

    @IsString()
    nhisInsuranceId:string;

    @IsNotEmpty()
    @IsString()
    street:string;

    @IsNotEmpty()
    @IsString()
    city:string;

    @IsNotEmpty()
    @IsString()
    state:string;

    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    dateOfEnrolment:string;

    @IsNotEmpty()
    @IsString()
    emergencyPerson:string;

    @IsNotEmpty()
    @IsString()
    emergencyAddress:string;

    @IsNotEmpty()
    @IsString()
    emergencyPhone:string;

    @IsNotEmpty()
    @IsString()
    gender:string;

    @IsNotEmpty()
    @IsString()
    maritalStatus:string;

    @IsNotEmpty()
    @IsString()
    firstName:string;

    @IsString()
    middleName:string;

    @IsNotEmpty()
    @IsString()
    lastName:string;

    @IsNotEmpty()
    @IsString()
    phoneNumber:string;

    @IsNotEmpty()
    @IsNumber()
    cancerStage: CancerStage;

    @IsNotEmpty()
    @IsNumber()
    cancerType: CancerType;

    @IsNotEmpty()
    @IsNumber()
    location: Location;
}
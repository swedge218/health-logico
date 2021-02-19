import {Role} from "../../../role/domain/role.entity";
import {Location} from "../../../location/domain/location.entity";
import {IsEmail, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    @IsEmail()
    email_address:string;

    @IsNotEmpty()
    @IsString()
    password:string;

    @IsNotEmpty()
    @IsNumber()
    supervisor:number;

    @IsNotEmpty()
    @IsString()
    first_name:string;

    @IsNotEmpty()
    @IsString()
    last_name:string;

    @IsNotEmpty()
    @IsString()
    phone_number: string;

    @IsNotEmpty()
    @IsNumber()
    location:Location; //should be FK

    @IsNotEmpty()
    @IsNumber()
    role: Role;
}
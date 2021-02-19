import {IsNotEmpty, MinLength, IsString, IsInt, IsNumber, IsEmail} from 'class-validator';

export class CreateClientDTO {

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsEmail()
    email:string;
}
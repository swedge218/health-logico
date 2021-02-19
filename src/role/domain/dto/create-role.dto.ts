import {IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateRoleDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    level: number;

    @IsNotEmpty()
    @IsArray()
    permissions: number[];

}
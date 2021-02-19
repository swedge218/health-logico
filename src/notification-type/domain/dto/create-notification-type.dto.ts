import {IsNotEmpty, IsString} from "class-validator";


export class CreateNotificationTypeDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    alias: string;

    @IsNotEmpty()
    @IsString()
    category: string;
}
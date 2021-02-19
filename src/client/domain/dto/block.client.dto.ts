import {IsNotEmpty, MinLength, IsString, IsInt, IsNumber, IsEmail, IsBoolean} from 'class-validator';

export class BlockClientDTO {

    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}
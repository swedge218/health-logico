import {IsNotEmpty, MinLength, IsString, IsInt, IsNumber} from 'class-validator';

export class CreateDeliveryStatusDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Title is too short'})
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
import {IsNotEmpty, MinLength, IsString, IsNumber, Min} from 'class-validator';

export class CreateOrderStatusDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(2, { message: 'Title is too short'})
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2, { message: 'Alias is too short'})
    alias: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0, { message: 'Cannot be less than 0'})
    sortOrder: number;
}
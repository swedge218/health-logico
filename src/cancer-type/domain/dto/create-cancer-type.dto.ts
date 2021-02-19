import {IsNotEmpty, MinLength, IsString, IsInt, IsNumber} from 'class-validator';
import {Location} from "../../../location/domain/location.entity";

export class CreateCancerTypeDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Title is too short'})
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
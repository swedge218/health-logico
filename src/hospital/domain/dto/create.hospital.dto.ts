import {IsNotEmpty, MinLength, IsString, IsInt, IsNumber} from 'class-validator';
import {Location} from "../../../location/domain/location.entity";

export class CreateHospitalDTO {

    // @IsNotEmpty()
    @IsString()
    @MinLength(10, { message: 'Title is too short'})
    title: string;

    @IsNotEmpty()
    street: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    contactName: string;

    @IsString()
    contactPhoneNumber: string;

    @IsNumber()
    location: Location;
}
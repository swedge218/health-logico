import {Manufacturer} from "../../../manufacturer/domain/manufacturer.entity";
import {IsDate, IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, MinLength} from "class-validator";

export class CreateProductDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    brandName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    formulation: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    genericName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    strength: string;

    @IsNotEmpty()
    @IsInt()
    thresholdValue: number;

    // @IsNotEmpty()
    // @IsNumber()
    // unitCost: number;

    @IsNotEmpty()
    @IsInt()
    manufacturer: Manufacturer;

}
import {Product} from "../../../product/domain/product.entity";
import {IsBoolean, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Hospital} from "../../../hospital/domain/hospital.entity";

export class CreateStockDTO {
    @IsNotEmpty()
    @IsNumber()
    product: Product;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    batchNumber: string;

    @IsNumber()
    hospital: Hospital;
}
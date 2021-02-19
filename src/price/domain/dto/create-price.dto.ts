import {Product} from "../../../product/domain/product.entity";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Stock} from "../../../stock/domain/stock.entity";

export class CreatePriceDTO {
    @IsNotEmpty()
    @IsNumber()
    product: Product;

    @IsNotEmpty()
    @IsString()
    batchNumber: string;

    @IsNotEmpty()
    @IsNumber()
    unitCost: number;

    // @IsNotEmpty()
    // @IsNumber()
    // stock: Stock;
}
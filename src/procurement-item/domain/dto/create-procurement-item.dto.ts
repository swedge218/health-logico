import {IsNotEmpty, MinLength, IsString, IsInt, IsNumber} from 'class-validator';
import {Product} from "../../../product/domain/product.entity";
import {Procurement} from "../../../procurement/domain/procurement.entity";

export class CreateProcurementItemDTO {

    @IsNotEmpty()
    @IsString()
    batchNumber:string;

    @IsNotEmpty()
    @IsString()
    expiryDate:string;

    @IsNotEmpty()
    @IsNumber()
    quantityReceived:number;

    @IsNotEmpty()
    @IsNumber()
    product: Product;

    @IsNotEmpty()
    @IsNumber()
    procurement: Procurement;
}
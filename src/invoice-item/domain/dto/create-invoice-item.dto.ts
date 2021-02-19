import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Product} from "../../../product/domain/product.entity";
import {Invoice} from "../../../invoice/domain/invoice.entity";

export class CreateInvoiceItemDTO {

    @IsNotEmpty()
    @IsNumber()
    invoice: Invoice;

    @IsNotEmpty()
    @IsNumber()
    product: Product;

    // @IsNotEmpty()
    // @IsString()
    // expiryDate: string;

    @IsNotEmpty()
    @IsString()
    batchNumber: string;

    @IsNotEmpty()
    @IsNumber()
    unitCost: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;
}
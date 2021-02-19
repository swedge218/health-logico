import {IsNumber, IsOptional} from "class-validator";

export class ProductFilterDTO {
    @IsNumber({}, { message: 'Enter a number' })
    @IsOptional()
    product: number;
}
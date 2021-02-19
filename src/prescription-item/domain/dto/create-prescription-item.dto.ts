import {IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Prescription} from "../../../prescription/domain/prescription.entity";
import {Product} from "../../../product/domain/product.entity";

export class CreatePrescriptionItemDTO {
    @IsNotEmpty()
    @IsString()
    dosage: string;

    @IsNotEmpty()
    @IsNumber()
    prescription: Prescription;

    @IsNotEmpty()
    @IsNumber()
    product: Product;
}
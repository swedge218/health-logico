import {Product} from "../../../product/domain/product.entity";
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Hospital} from "../../../hospital/domain/hospital.entity";
import {AdjustmentActionEnums, AdjustmentTypeEnums} from "../enums/adjustment.type.enums";

export class CreateAdjustmentDTO {
    @IsNotEmpty()
    @IsNumber()
    product: Product;

    @IsNotEmpty()
    @IsString({message: "Adjustment Type must be a known adjustment type string"})
    adjustmentType: AdjustmentTypeEnums;

    @IsNotEmpty()
    @IsString({message: "Adjustment Action must be a known adjustment action string"})
    adjustmentAction: AdjustmentActionEnums;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    batchNumber: string;

    @IsNotEmpty()
    @IsString()
    remarks: string;

    @IsOptional()
    @IsNumber()
    hospital: Hospital;
}
import {IsNumber, IsOptional} from "class-validator";

export class DateFilterDTO {
    @IsNumber({}, { message: 'Enter a numeric month value' })
    @IsOptional()
    month: number;

    @IsNumber({}, { message: 'Enter a numeric year value' })
    @IsOptional()
    year: number;
}
import {IsNumber, IsOptional} from "class-validator";

export class HospitalFilterDTO {
    @IsNumber({}, { message: 'Enter a number' })
    @IsOptional()
    hospital: number;
}
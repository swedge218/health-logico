import {IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Patient} from "../../../patient/domain/patient.entity";


export class CreatePrescriptionDTO {
    // @IsNotEmpty()
    // @IsString()
    // title: string;

    @IsNotEmpty()
    @IsNumber()
    active: number;

    @IsNotEmpty()
    @IsNumber()
    patient: Patient;

    @IsNotEmpty()
    @IsArray()
    items: JSON[] //[{product: 7, dosage: ""}]
}
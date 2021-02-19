import {IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Patient} from "../../../patient/domain/patient.entity";
import {Prescription} from "../prescription.entity";


export class CreatePrescriptionDTO {
    @IsNotEmpty()
    @IsNumber()
    active: number;

    @IsNotEmpty()
    @IsNumber()
    prescription: Prescription;

    @IsNotEmpty()
    @IsNumber()
    patient: Patient;

    @IsNotEmpty()
    @IsArray()
    items: JSON[] //[{product: 7, dosage: ""}]
}
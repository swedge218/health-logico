import {CreatePrescriptionDTO} from "./dto/create-precription.dto";
import {Prescription} from "./prescription.entity";


export class PrescriptionMapper{
    fromDTO(dto: CreatePrescriptionDTO): Prescription {
        const prescription: Prescription = new Prescription();

        // prescription.title = dto.title;
        prescription.active = dto.active;
        prescription.patient = dto.patient;

        return prescription;
    }
}
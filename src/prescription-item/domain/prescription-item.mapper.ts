import {CreatePrescriptionItemDTO} from "./dto/create-prescription-item.dto";
import {PrescriptionItem} from "./prescription-item.entity";
import {Prescription} from "../../prescription/domain/prescription.entity";
import {Product} from "../../product/domain/product.entity";

export class PrescriptionItemMapper{
    fromDTO(dto: any): PrescriptionItem {
        const prescriptionItem: PrescriptionItem = new PrescriptionItem();

        prescriptionItem.dosage = dto.dosage;
        prescriptionItem.product = dto.product;
        prescriptionItem.prescription = dto.prescription;

        return prescriptionItem;
    }

    toDTO(prescription: Prescription, product: Product, dosage: string): CreatePrescriptionItemDTO {
        const dto: CreatePrescriptionItemDTO = new CreatePrescriptionItemDTO();

        dto.prescription = prescription;
        dto.dosage = dosage;
        dto.product = product;

        return dto;
    }
}
import { Injectable } from '@nestjs/common';
import {PrescriptionItemModel} from "./domain/prescription-item.model";
import {PrescriptionItem} from "./domain/prescription-item.entity";
import {CreatePrescriptionItemDTO} from "./domain/dto/create-prescription-item.dto";
import {UpdatePrescriptionItemDTO} from "./domain/dto/update-prescription-item.dto";

@Injectable()
export class PrescriptionItemService {
    constructor(
        private prescriptionItemModel: PrescriptionItemModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.prescriptionItemModel.findAll(options);
    }

    async findOne(id: number): Promise<PrescriptionItem> {
        return this.prescriptionItemModel.findOne(id);
    }

    async create(createPrescriptionItemDTO: CreatePrescriptionItemDTO): Promise<PrescriptionItem> {
        return this.prescriptionItemModel.save(createPrescriptionItemDTO);
    }

    async update(id: number, updatePrescriptionItemDTO: UpdatePrescriptionItemDTO): Promise<PrescriptionItem> {
        return this.prescriptionItemModel.update(id,  updatePrescriptionItemDTO);
    }

    async remove(id: number): Promise<any> {
        return this.prescriptionItemModel.remove(id);
    }

    async removeByPrescription(prescId: number): Promise<any> {
        return this.prescriptionItemModel.removeByPrescription(prescId);
    }
}
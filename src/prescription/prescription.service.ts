import { Injectable } from '@nestjs/common';

import {PrescriptionModel} from "../prescription/domain/prescription.model";
import {Prescription} from "../prescription/domain/prescription.entity";
import {CreatePrescriptionDTO} from "./domain/dto/create-precription.dto";

@Injectable()
export class PrescriptionService {
    constructor(
        private prescriptionModel: PrescriptionModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.prescriptionModel.findAll(options);
    }

    async findOne(id: number): Promise<Prescription> {
        return this.prescriptionModel.findOne(id);
    }

    async create(createPrescriptionDTO: CreatePrescriptionDTO): Promise<Prescription> {
        return this.prescriptionModel.saveTransaction(createPrescriptionDTO);
    }

    async update(id: number, createPrescriptionDTO: CreatePrescriptionDTO): Promise<Prescription> {
        return this.prescriptionModel.updateTransaction(id,  createPrescriptionDTO);
    }

    async remove(id: number): Promise<any> {
        return this.prescriptionModel.remove(id);
    }
}

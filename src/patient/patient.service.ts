import { Injectable } from '@nestjs/common';
import {CreatePatientDTO} from "./domain/dto/create-patient.dto";
import {PatientModel} from "./domain/patient.model";
import {Patient} from "./domain/patient.entity";


@Injectable()
export class PatientService {

    constructor(
        private patientModel: PatientModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.patientModel.findAll(options);
    }

    async findOne(id: number): Promise<Patient> {
        return this.patientModel.findOne(id);
    }

    async create(createPatientDTO: CreatePatientDTO): Promise<Patient> {
        return this.patientModel.save(createPatientDTO);
    }

    async update(id: number, createPatientDTO: CreatePatientDTO): Promise<Patient> {
        return this.patientModel.update(id,  createPatientDTO);
    }

    async remove(id: number): Promise<any> {
        return this.patientModel.remove(id);
    }
}
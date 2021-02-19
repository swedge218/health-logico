import { Injectable } from '@nestjs/common';
import {Hospital} from "./domain/hospital.entity";
import {CreateHospitalDTO} from "./domain/dto/create.hospital.dto";
import {HospitalModel} from "../hospital/domain/hospital.model";

@Injectable()
export class HospitalService {
    constructor(
        private hospitalModel: HospitalModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.hospitalModel.findAll(options);
    }

    async findOne(id: number): Promise<Hospital> {
        return this.hospitalModel.findOne(id);
    }

    async create(createHospitalDTO: CreateHospitalDTO): Promise<Hospital> {
        return this.hospitalModel.save(createHospitalDTO);
    }

    async update(id: number, createHospitalDTO: CreateHospitalDTO): Promise<Hospital> {
        return this.hospitalModel.update(id,  createHospitalDTO);
    }

    async remove(id: number): Promise<any> {
        return this.hospitalModel.remove(id);
    }
}

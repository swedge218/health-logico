import { Injectable } from '@nestjs/common';
import {ProcurementModel} from "./domain/procurement.model";
import {Procurement} from "./domain/procurement.entity";
import {CreateProcurementDTO} from "./domain/dto/create-procurement.dto";


@Injectable()
export class ProcurementService {

    constructor(
        private procurementModel: ProcurementModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.procurementModel.findAll(options);
    }

    async findOne(id: number): Promise<Procurement> {
        console.log('service');
        return this.procurementModel.findOne(id);
    }

    async findRelatedData(id: number): Promise<Procurement> {
        return this.procurementModel.findRelatedData(id)
    }

    async create(createProcurementDTO: CreateProcurementDTO): Promise<Procurement> {
        return this.procurementModel.saveTransaction(createProcurementDTO);
    }

    async update(id: number, createProcurementDTO: CreateProcurementDTO): Promise<Procurement> {
        return this.procurementModel.update(id,  createProcurementDTO);
    }

    async remove(id: number): Promise<any> {
        return this.procurementModel.remove(id);
    }
}
import { Injectable } from '@nestjs/common';
import {CreateCancerTypeDTO} from "./domain/dto/create-cancer-type.dto";
import {CancerTypeModel} from "./domain/cancer-type.model";
import {CancerType} from "./domain/cancer-type.entity";


@Injectable()
export class CancerTypeService {

    constructor(
        private cancerTypeModel: CancerTypeModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.cancerTypeModel.findAll(options);
    }

    async findOne(id: number): Promise<CancerType> {
        return this.cancerTypeModel.findOne(id);
    }

    async create(createCancerTypeDTO: CreateCancerTypeDTO): Promise<CancerType> {
        return this.cancerTypeModel.save(createCancerTypeDTO);
    }

    async update(id: number, createCancerTypeDTO: CreateCancerTypeDTO): Promise<CancerType> {
        return this.cancerTypeModel.update(id,  createCancerTypeDTO);
    }

    async remove(id: number): Promise<any> {
        return this.cancerTypeModel.remove(id);
    }
}
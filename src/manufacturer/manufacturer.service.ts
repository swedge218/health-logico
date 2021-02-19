import { Injectable } from '@nestjs/common';
import {CreateManufacturerDTO} from "./domain/dto/create.manufacturer.dto";
import {ManufacturerModel} from "./domain/manufacturer.model";
import {Manufacturer} from "./domain/manufacturer.entity";

@Injectable()
export class ManufacturerService {

    constructor(
        private manufacturerModel: ManufacturerModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.manufacturerModel.findAll(options);
    }

    async findOne(id: number): Promise<Manufacturer> {
        return this.manufacturerModel.findOne(id);
    }

    async create(createManufacturerDTO: CreateManufacturerDTO): Promise<Manufacturer> {
        return this.manufacturerModel.save(createManufacturerDTO);
    }

    async update(id: number, createManufacturerDTO: CreateManufacturerDTO): Promise<Manufacturer> {
        return this.manufacturerModel.update(id,  createManufacturerDTO);
    }

    async remove(id: number): Promise<any> {
        return this.manufacturerModel.remove(id);
    }
}

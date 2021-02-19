import { Injectable } from '@nestjs/common';
import {CancerStageModel} from "./domain/cancer-stage.model";
import {CancerStage} from "./domain/cancer-stage.entity";
import {CreateCancerStageDTO} from "./domain/dto/create-cancer-stage.dto";



@Injectable()
export class CancerStageService {

    constructor(
        private cancerStageModel: CancerStageModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.cancerStageModel.findAll(options);
    }

    async findOne(id: number): Promise<CancerStage> {
        return this.cancerStageModel.findOne(id);
    }

    async create(createCancerStageDTO: CreateCancerStageDTO): Promise<CancerStage> {
        return this.cancerStageModel.save(createCancerStageDTO);
    }

    async update(id: number, createCancerStageDTO: CreateCancerStageDTO): Promise<CancerStage> {
        return this.cancerStageModel.update(id,  createCancerStageDTO);
    }

    async remove(id: number): Promise<any> {
        return this.cancerStageModel.remove(id);
    }
}
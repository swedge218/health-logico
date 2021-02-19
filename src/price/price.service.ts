import { Injectable } from '@nestjs/common';
import {PriceModel} from "./domain/price.model";
import {Price} from "./domain/price.entity";
import {CreatePriceDTO} from "./domain/dto/create-price.dto";


@Injectable()
export class PriceService {

    constructor(
        private priceModel: PriceModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.priceModel.findAll(options);
    }

    async findAllNoPrice(options: any): Promise<any[]> {
        return this.priceModel.findAllNoPrice(options);
    }

    async findOne(id: number): Promise<Price> {
        return this.priceModel.findOne(id);
    }

    async findPrice(productId: number, batchNumber: string): Promise<number> {
        return this.priceModel.findPrice(productId, batchNumber);
    }

    async findRelatedData(id: number): Promise<Price> {
        return this.priceModel.findRelatedData(id)
    }

    async create(createPriceDTO: CreatePriceDTO): Promise<Price> {
        return this.priceModel.save(createPriceDTO);
    }

    async update(id: number, createPriceDTO: CreatePriceDTO): Promise<Price> {
        return this.priceModel.update(id,  createPriceDTO);
    }

    async remove(id: number): Promise<any> {
        return this.priceModel.remove(id);
    }
}
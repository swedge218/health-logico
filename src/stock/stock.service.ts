import { Injectable } from '@nestjs/common';
import {StockModel} from "./domain/stock.model";
import {Stock} from "./domain/stock.entity";
import {Adjustment} from "../adjustment/domain/adjustment.entity";
// import {Adjustment} from "../adjustment/domain/adjustment.entity";


@Injectable()
export class StockService {

    constructor(
        private stockModel: StockModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.stockModel.findAll(options);
    }

    async findOne(id: number): Promise<Stock> {
        return this.stockModel.findOne(id);
    }

    async facilityHasProductRegistered(productId: number, batchNumber: string, hospitalId: number): Promise<boolean> {

        return this.stockModel.facilityHasProductRegistered(productId, batchNumber, hospitalId);
    }

    async findStock(productId: number, batchNumber: string, hospitalId: number): Promise<Stock> {

        return this.stockModel.findStock(productId, batchNumber, hospitalId);
    }

    async findProductStock(productId: number, hospitalId: number, options: any): Promise<Stock[]> {
        return this.stockModel.findProductStock(productId, options, hospitalId);
    }

    async findProductStockAggs(productId: number, hospitalId: number, options: any): Promise<Stock[]> {
        return this.stockModel.findProductStockAggs(productId, options, hospitalId);
    }

    // async create(adjustment: Adjustment): Promise<Stock> {
    //     return this.stockModel.setupInitialRegistration(createStockDTO);
    // }

    async update(adjustment: Adjustment): Promise<any> {
        return this.stockModel.update(adjustment);
    }


    // async remove(id: number): Promise<any> {
    //     return this.stockModel.remove(id);
    // }
}
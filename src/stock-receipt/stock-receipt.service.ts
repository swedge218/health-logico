import { Injectable } from '@nestjs/common';
import {StockReceipt} from "./domain/stock-receipt.entity";
import {CreateStockReceiptDTO} from "./domain/dto/create-stock-receipt.dto";
import {StockReceiptModel} from "./domain/stock-receipt.model";

@Injectable()
export class StockReceiptService {
    constructor(
        private stockReceiptModel: StockReceiptModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.stockReceiptModel.findAll(options);
    }

    async findOne(id: number): Promise<StockReceipt> {
        return this.stockReceiptModel.findOne(id);
    }

    // async findMyOrderId(receiptId: number) {
    //     return this.stockReceiptModel.findOne(receiptId)
    //         .then()
    // }

    async findRelatedData(id: number): Promise<StockReceipt> {
        return this.stockReceiptModel.findRelatedData(id);
    }

    async create(createStockReceiptDTO: CreateStockReceiptDTO): Promise<StockReceipt> {
        return this.stockReceiptModel.saveTransaction(createStockReceiptDTO);
    }

    async update(id: number, createStockReceiptDTO: CreateStockReceiptDTO): Promise<StockReceipt> {
        return this.stockReceiptModel.update(id,  createStockReceiptDTO);
    }

    async remove(id: number): Promise<any> {
        return this.stockReceiptModel.remove(id);
    }
}

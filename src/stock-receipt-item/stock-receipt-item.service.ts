import { Injectable } from '@nestjs/common';
import {StockReceiptItem} from "./domain/stock-receipt-item.entity";
import {StockReceiptItemModel} from "./domain/stock-receipt-item.model";
import {AdjustmentService} from "../adjustment/adjustment.service";

@Injectable()
export class StockReceiptItemService {
    constructor(
        private stockReceiptItemModel: StockReceiptItemModel,
        private adjustmentService: AdjustmentService
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.stockReceiptItemModel.findAll(options);
    }

    async findOne(id: number): Promise<StockReceiptItem> {
        return this.stockReceiptItemModel.findOne(id);
    }

    async findOrderItem(id: number): Promise<any> {
        return this.stockReceiptItemModel.findRelatedData(id);
    }

    // async create(createStockReceiptItemDTO: CreateStockReceiptItemDTO): Promise<StockReceiptItem> {
    //     return this.stockReceiptItemModel.save(createStockReceiptItemDTO)
    //         .then(async item => {
    //             return this.stockReceiptItemModel.findRelatedData(item.id)
    //                 .then(data => {
    //                     const product = this.stockReceiptItemModel.extractProductFromReceiptItemData(data);
    //                     const hospital = this.stockReceiptItemModel.extractHospitalFromReceiptItemData(data);
    //
    //                     return this.adjustmentService.upAdjustment(
    //                         product,
    //                         item.quantityReceived,
    //                         NEW_RECEIPT_REMARK,
    //                         hospital)
    //                         .then(adjustment => {
    //                             return item;
    //                         })
    //                 })
    //         })
    // }

    // async update(id: number, createStockReceiptItemDTO: CreateStockReceiptItemDTO): Promise<StockReceiptItem> {
    //     return this.stockReceiptItemModel.update(id,  createStockReceiptItemDTO);
    // }
    //
    // async remove(id: number): Promise<any> {
    //     return this.stockReceiptItemModel.remove(id);
    // }
}

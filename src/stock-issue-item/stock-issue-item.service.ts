import { Injectable } from '@nestjs/common';
import {StockIssueItem} from "./domain/stock-issue-item.entity";
import {StockIssueItemModel} from "./domain/stock-issue-item.model";
import {AdjustmentService} from "../adjustment/adjustment.service";
import {OrderItemService} from "../order-item/order-item.service";

@Injectable()
export class StockIssueItemService {
    constructor(
        private stockIssueItemModel: StockIssueItemModel,
        private adjustmentService: AdjustmentService,
        private orderItemService: OrderItemService
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.stockIssueItemModel.findAll(options);
    }

    async findOne(id: number): Promise<StockIssueItem> {
        return this.stockIssueItemModel.findOne(id);
    }

    // async create(createStockIssueItemDTO: CreateStockIssueItemDTO): Promise<StockIssueItem> {
    //     return this.stockIssueItemModel.save(createStockIssueItemDTO)
    //         .then(async item => {
    //             return this.stockIssueItemModel.findRelatedData(item.id)
    //                 .then(data => {
    //                     const product = this.stockIssueItemModel.extractProductFromItemData(data);
    //
    //                     return this.adjustmentService.downAdjustment(
    //                         product, item.quantityIssued, NEW_ISSUE_REMARK)
    //                         .then(adjustment => {
    //                             return item;
    //                         })
    //                 })
    //         })
    // }

    // async update(id: number, createStockIssueItemDTO: CreateStockIssueItemDTO): Promise<StockIssueItem> {
    //     return this.stockIssueItemModel.update(id,  createStockIssueItemDTO);
    // }
    //
    // async remove(id: number): Promise<any> {
    //     return this.stockIssueItemModel.remove(id);
    // }
}

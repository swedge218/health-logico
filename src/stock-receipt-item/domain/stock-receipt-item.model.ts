import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {StockReceiptItem} from "./stock-receipt-item.entity";
import {CreateStockReceiptItemDTO} from "./dto/create-stock-receipt-item.dto";
import {StockReceiptItemMapper} from "./stock-receipt-item.mapper";
import { UpdateResult, DeleteResult } from  'typeorm';
import {StockReceipt} from "../../stock-receipt/domain/stock-receipt.entity";
import {StockIssueItem} from "../../stock-issue-item/domain/stock-issue-item.entity";
import {BaseModel} from "../../app.basemodel";
import {NEW_RECEIPT_REMARK} from "./constants/stock-receipt-item.constants";

@Injectable()
export class StockReceiptItemModel extends BaseModel{
    constructor(
        @InjectRepository(StockReceiptItem)
        private readonly repository: Repository<StockReceiptItem>
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<StockReceiptItem>> {
        return this.repository
            .createQueryBuilder('sri')
            .leftJoinAndSelect("sri.issueItem", "issueItem")
            .leftJoinAndSelect("sri.stockReceipt", "stockReceipt");
    }

    async findAll(options: any): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;
        const count = await this.repository.count();
        const SQB = await this.findTemplate();

        return SQB
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return StockReceiptItemModel.makePainationData(items, options, count);
            });
    }


    async findOne(id: number): Promise<StockReceiptItem> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findRelatedData(id: number): Promise<any> {
        const receiptItem: StockReceiptItem[] = await  this.repository.find({
            join: {
                alias: 'receiptItem',
                innerJoinAndSelect: {
                    issueItem: "receiptItem.issueItem",
                    orderItem: "issueItem.orderItem",
                    product: "orderItem.product",
                    order: "orderItem.order",
                    hospital: "order.hospital"
                },
            },
            where: {id: id},
        });

        return receiptItem[0];
    }

    extractProductFromReceiptItemData(data: any) {
        return data.issueItem.orderItem.product;
    }

    extractHospitalFromReceiptItemData(data: any) {
        return data.hospital;
    }


    async save(createStockReceiptItemDTO: CreateStockReceiptItemDTO): Promise<StockReceiptItem> {
        const stockReceiptItem: StockReceiptItem = new StockReceiptItemMapper().fromDTO(createStockReceiptItemDTO);
        return this.repository.save(stockReceiptItem)
            .then(stockReceiptItem => stockReceiptItem)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    // async update(id: number, createStockReceiptItemDTO: CreateStockReceiptItemDTO): Promise<StockReceiptItem> {
    //     const stockReceiptItem: StockReceiptItem = new StockReceiptItemMapper().fromDTO(createStockReceiptItemDTO);
    //     return this.repository.update(id,  stockReceiptItem)
    //         .then(() => {
    //             const awai this.findOne(id)
    //             const product = this.stockReceiptItemModel.extractProductFromReceiptItemData(data);
    //             const hospital = this.stockReceiptItemModel.extractHospitalFromReceiptItemData(data);
    //
    //             return this.adjustmentService.upAdjustment(
    //                 product,
    //                 item.quantityReceived,
    //                 NEW_RECEIPT_REMARK,
    //                 hospital)
    //                 .then(adjustment => {
    //                     return item;
    //                 })
    //         })
    //         .catch((e) => {
    //             throw new InternalServerErrorException(e)
    //         })
    // }

    async remove(id: number): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }

    async setUpReceiptItemDTO(receipt: StockReceipt, issueItem: StockIssueItem,
                        quantity: number, batchNumber: string): Promise<CreateStockReceiptItemDTO> {

        return new StockReceiptItemMapper().toDTO(receipt, issueItem, quantity, batchNumber);
    }
}
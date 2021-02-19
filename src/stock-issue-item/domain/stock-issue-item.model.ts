import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {StockIssueItem} from "./stock-issue-item.entity";
import {CreateStockIssueItemDTO} from "./dto/create-stock-issue-item.dto";
import {StockIssueItemMapper} from "./stock-issue-item.mapper";
import { UpdateResult, DeleteResult } from  'typeorm';
import {OrderItem} from "../../order-item/domain/order-item.entity";
import {StockIssue} from "../../stock-issue/domain/stock-issue.entity";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class StockIssueItemModel extends BaseModel{
    constructor(
        @InjectRepository(StockIssueItem)
        private readonly repository: Repository<StockIssueItem>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<StockIssueItem>> {
        return this.repository
            .createQueryBuilder("sii")
            .leftJoinAndSelect("sii.orderItem", "orderItem")
            .leftJoinAndSelect("orderItem.product", "product")
            .leftJoinAndSelect("sii.stockIssue", "stockIssue")

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
                return StockIssueItemModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<StockIssueItem> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findRelatedData(id: number): Promise<any> {
        const item: StockIssueItem[] = await  this.repository.find({
            join: {
                alias: 'item',
                innerJoinAndSelect: {
                    orderItem: "item.orderItem",
                    product: 'orderItem.product',
                    order: "orderItem.order",
                    hospital: "order.hospital"
                },
            },
            where: {id: id},
        });

        return item[0];
    }

    extractProductFromItemData(data: any) {
        return data.orderItem.product;
    }

    extractHospitalFromItemData(data: any) {
        return data.stockIssue.order.hospital;
    }

    async save(createStockIssueItemDTO: CreateStockIssueItemDTO): Promise<StockIssueItem> {
        const stockIssueItem: StockIssueItem = new StockIssueItemMapper().fromDTO(createStockIssueItemDTO);
        return this.repository.save(stockIssueItem)
            .then(stockIssueItem => stockIssueItem)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createStockIssueItemDTO: CreateStockIssueItemDTO): Promise<StockIssueItem> {
        const stockIssueItem: StockIssueItem = new StockIssueItemMapper().fromDTO(createStockIssueItemDTO);
        return this.repository.update(id,  stockIssueItem)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }

    async setUpIssueItemDTO(issue: StockIssue, orderItem: OrderItem,
                      quantityIssued: number, batchNumber: string): Promise<CreateStockIssueItemDTO> {

        return new StockIssueItemMapper().toDTO(issue, orderItem, quantityIssued, batchNumber);
    }
}
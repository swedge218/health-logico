import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {Connection, getConnection, Repository, SelectQueryBuilder, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {StockReceipt} from "./stock-receipt.entity";
import {CreateStockReceiptDTO} from "./dto/create-stock-receipt.dto";
import {StockReceiptMapper} from "./stock-receipt.mapper";
import {StockReceiptItemModel} from "../../stock-receipt-item/domain/stock-receipt-item.model";
import {StockReceiptItem} from "../../stock-receipt-item/domain/stock-receipt-item.entity";
import {StockReceiptItemMapper} from "../../stock-receipt-item/domain/stock-receipt-item.mapper";
import {BaseModel} from "../../app.basemodel";
import {StockIssueItemModel} from "../../stock-issue-item/domain/stock-issue-item.model";
import {AdjustmentModel} from "../../adjustment/domain/adjustment.model";
import {NEW_RECEIPT_REMARK} from "../../stock-receipt-item/domain/constants/stock-receipt-item.constants";
import {StockIssueModel} from "../../stock-issue/domain/stock-issue.model";
import {StockIssue} from "../../stock-issue/domain/stock-issue.entity";
import {StockIssueStatusEnums} from "../../stock-issue/domain/enums/stock-issue-enums";
import {StockIssueItem} from "../../stock-issue-item/domain/stock-issue-item.entity";
import {AdjustmentActionEnums} from "../../adjustment/domain/enums/adjustment.type.enums";

@Injectable()
export class StockReceiptModel extends BaseModel{
    constructor(
        @InjectRepository(StockReceipt)
        private readonly repository: Repository<StockReceipt>,
        private stockReceiptItemModel: StockReceiptItemModel,
        private stockIssueItemModel: StockIssueItemModel,
        private stockIssueModel: StockIssueModel,
        private adjustmentModel: AdjustmentModel,
        private connection: Connection = getConnection()
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<StockReceipt>> {
        return this.repository
            .createQueryBuilder("sreceipt")
            .leftJoinAndSelect("sreceipt.stockIssue", "stockIssue")
            .leftJoinAndSelect("sreceipt.hospital", "hospital")
            .leftJoinAndSelect("stockIssue.order", "order")
            .leftJoinAndSelect("stockIssue.issuingOfficer", "issuingOfficer")
            .leftJoinAndSelect("sreceipt.stockReceiptItems", "stockReceiptItems")
            .leftJoinAndSelect("stockReceiptItems.issueItem", "stockIssueItems");
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
                return StockReceiptModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<StockReceipt> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }


    async findRelatedData(id: number): Promise<StockReceipt> {
        const stockReceipt: StockReceipt[] = await this.repository.find({
            join: {
                alias: 'stockReceipt',
                innerJoinAndSelect: {
                    stockReceiptItem: "stockReceipt.stockReceiptItems",
                    issueItem: "stockReceiptItem.issueItem"
                },
            },
            where: {id: id},
        });

        return stockReceipt[0];
    }

    async save(createStockReceiptDTO: CreateStockReceiptDTO): Promise<StockReceipt> {
        const stockReceipt: StockReceipt = new StockReceiptMapper().fromDTO(createStockReceiptDTO);
        return this.repository.save(stockReceipt)
            .then(stockReceipt => stockReceipt)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }


    async saveTransaction(createStockReceiptDTO: CreateStockReceiptDTO): Promise<StockReceipt> {
        let stockReceipt: StockReceipt = new StockReceiptMapper().fromDTO(createStockReceiptDTO);
        let issueId = Number(createStockReceiptDTO.stockIssue)
        const itemsList: JSON[] = createStockReceiptDTO.items;

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            return queryRunner.manager.save(stockReceipt)
                .then(async s => {
                    stockReceipt = s;
                    return stockReceipt;

                }).then(async (stockReceipt) => {
                    return Promise.all(
                        itemsList.map(async (item) => {
                            const issueItemId: number = Number(item['issueItem']);
                            const stockIssueItem = await this.stockIssueItemModel.findOne(issueItemId);
                            const quantity = item['quantity'];

                            const receipt = await this.stockReceiptItemModel.setUpReceiptItemDTO(
                                    stockReceipt, item['issueItem'], quantity, stockIssueItem.batchNumber);
                            return receipt;
                        })
                    )
                }).then(async (receiptItemDTOList) => {
                    return Promise.all(
                        receiptItemDTOList.map( async (item) => {
                            let mappedStockReceiptItem: StockReceiptItem =
                                new StockReceiptItemMapper().fromDTO(item);
                            let stockReceiptItem = queryRunner.manager.save(mappedStockReceiptItem);
                            return stockReceiptItem;
                        })
                    )

                }).then(async stockReceiptItemsList => {

                    return Promise.all(
                        stockReceiptItemsList.map( async (item) => {
                            const stockIssueItem = await this.stockIssueItemModel.findOne(
                                Number(item.issueItem));

                            await this.adjustmentModel.upAdjustment(
                                stockIssueItem.orderItem.product,
                                item.quantityReceived,
                                item.batchNumber, //batch number
                                AdjustmentActionEnums.RECEIPT,
                                NEW_RECEIPT_REMARK,
                                stockReceipt.hospital);

                            return stockIssueItem;
                        })
                    )

                }).then(async (stockIssueItemsList) => { //set status for stockIssueItems
                    stockIssueItemsList.map(async (item) => {
                        return queryRunner.manager.update(
                            StockIssueItem, item.id, {status: StockIssueStatusEnums.ATTENDED});
                    })
                }).then(async () => { //set status for stockIssue
                    return await queryRunner.manager.update(
                        StockIssue, issueId, {status: StockIssueStatusEnums.ATTENDED});
                }).then(async () => {
                    await queryRunner.commitTransaction();
                    return this.findOne(stockReceipt.id)
                })

        } catch(err)  {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        }
    }

    async update(id: number, createStockReceiptDTO: CreateStockReceiptDTO): Promise<StockReceipt> {
        const stockReceipt: StockReceipt = new StockReceiptMapper().fromDTO(createStockReceiptDTO);
        return this.repository.update(id,  stockReceipt)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }
}
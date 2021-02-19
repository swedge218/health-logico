import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {Connection, getConnection, Repository, SelectQueryBuilder, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {StockIssue} from "./stock-issue.entity";
import {CreateStockIssueDTO} from "./dto/create-stock-issue.dto";
import {StockIssueMapper} from "./stock-issue.mapper";
import {Order} from "../../order/domain/order.entity";
import {User} from "../../user/domain/user.entity";
import {StockIssueItemModel} from "../../stock-issue-item/domain/stock-issue-item.model";
import {OrderItem} from "../../order-item/domain/order-item.entity";
import {StockIssueItem} from "../../stock-issue-item/domain/stock-issue-item.entity";
import {StockIssueItemMapper} from "../../stock-issue-item/domain/stock-issue-item.mapper";
import {NEW_ISSUE_REMARK} from "./constants/stock-issue.constants";
import {BaseModel} from "../../app.basemodel";
import {AdjustmentModel} from "../../adjustment/domain/adjustment.model";
import {OrderItemModel} from "../../order-item/domain/order-item.model";
import {StockIssueStatusEnums, StockIssueTypeEnums} from "./enums/stock-issue-enums";
import {StockModel} from "../../stock/domain/stock.model";
import {DateFunctions} from "../../utils/date.functions";
import {AdjustmentActionEnums} from "../../adjustment/domain/enums/adjustment.type.enums";

@Injectable()
export class StockIssueModel extends BaseModel{
    transientItems: JSON[] = []

    constructor(
        @InjectRepository(StockIssue)
        private readonly repository: Repository<StockIssue>,
        private stockIssueItemModel: StockIssueItemModel,
        private stockModel: StockModel,
        private orderItemModel: OrderItemModel,
        private adjustmentModel: AdjustmentModel,
        private connection: Connection = getConnection()
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<StockIssue>> {
        return this.repository
            .createQueryBuilder('stockIssue')
            .leftJoinAndSelect("stockIssue.order", "order")
            .leftJoinAndSelect("stockIssue.issuingOfficer", "issuingOfficer")
            .leftJoinAndSelect("stockIssue.stockIssueItems", "stockIssueItems")
            .leftJoinAndSelect("stockIssueItems.orderItem", "orderItem")
            .leftJoinAndSelect("orderItem.product", "product")
    }

    isValidStatus(status: string): boolean {
        return status === StockIssueStatusEnums.ATTENDED
            || status === StockIssueStatusEnums.UNATTENDED;
    }

    async findAll(options: any): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;

        const status: string = options.status;
        const SQB = await this.findTemplate();
        let statusEnumValue: StockIssueStatusEnums = StockIssueStatusEnums.ATTENDED;
        let count = 0;

        if(this.isValidStatus(status)) {
            statusEnumValue = status === statusEnumValue
                ? statusEnumValue : StockIssueStatusEnums.UNATTENDED;
            SQB.where("stockIssue.status = :status", {status: status});
            count = await this.repository.count({status: statusEnumValue});
        } else {
            count = await this.repository.count();
        }

        return SQB
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return StockIssueModel.makePainationData(items, options, count);
            });
    }


    async findOne(id: number): Promise<StockIssue> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findHospitalIssues(hospitalId: number): Promise<any[]> {
        return this.findTemplate().then(sqb => {
             return sqb.where( 'hospital_id = :hospitalId', {hospitalId: hospitalId})
                .groupBy('stockIssue.created_at')
                .getMany()
                .then(rows => {
                    let lastDate = '';
                    let acc = [{}];
                    for(const key in rows) {
                        const curr = rows[key];
                        const currDate = DateFunctions.formatToDBDate(curr.createdDate);
                        // acc[currDate] = curr;

                        if(lastDate == currDate){
                            acc[0][lastDate].push(curr);
                        } else {
                            lastDate = currDate;
                            acc[0][lastDate] = [];
                            acc[0][lastDate].push(curr);
                        }
                    }

                    return acc;
                })
        });
    }

    async findIssueTypes(): Promise<any> {
        return {
            "NORMAL": StockIssueTypeEnums.NORMAL,
            "EMERGENCY": StockIssueTypeEnums.EMERGENCY
        };
    }


    async findRelatedData(id: number): Promise<StockIssue> {

        const stockIssue: StockIssue[] = await this.repository.find({
            join: {
                alias: 'stockIssue',
                innerJoinAndSelect: {
                    orderItem: "stockIssue.stockIssueItems"
                },
            },
            where: {id: id},
        });

        return stockIssue[0];
    }

    async save(createStockIssueDTO: CreateStockIssueDTO): Promise<StockIssue> {
        const stockIssue: StockIssue = new StockIssueMapper().fromDTO(createStockIssueDTO);
        return this.repository.save(stockIssue)
            .then(stockIssue => stockIssue)
            .catch((e) => {
                throw new InternalServerErrorException(e);
            })
    }


    async saveTransaction(createStockIssueDTO: CreateStockIssueDTO): Promise<StockIssue> {
        let stockIssue: StockIssue = new StockIssueMapper().fromDTO(createStockIssueDTO);
        const itemsList: JSON[] = createStockIssueDTO.items;

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            return queryRunner.manager.save(stockIssue)
                .then(async (issue) => {
                    stockIssue = issue;
                    return stockIssue;

                }).then(stockIssue => {

                    return Promise.all(
                        itemsList.map(async (item) => {

                            const orderItem = await this.orderItemModel.findOne(item['order_item']);
                            const productId = orderItem.product.id;
                            const quantity = item['quantity_issued'];
                            const batchNumber = item['batch_number'];
                            const hospitalId = null;

                            // check stock here
                            console.log('VALUES', productId, batchNumber, hospitalId, quantity);
                            const isStocked = await this.stockModel.isStockedAndEnough(
                                productId, batchNumber, hospitalId, quantity, false);
                            if(!isStocked) {
                                await queryRunner.rollbackTransaction();
                                throw new BadRequestException(this.stockModel.stockFulfilmentFailureText(productId, batchNumber));
                            }

                            const stockIssueItemDTO = await this.stockIssueItemModel.setUpIssueItemDTO(
                                stockIssue, orderItem, quantity, batchNumber);

                            return stockIssueItemDTO;
                        })
                    )

                    // return stockItemDTOList;

                }).then(async (stockItemDTOList) => {
                    console.log('stockItemDTOList', stockItemDTOList);
                    let that = this;
                    return Promise.all(
                        stockItemDTOList.map( async (item) => {
                            let mappedStockIssueItem: StockIssueItem =
                                new StockIssueItemMapper().fromDTO(item);

                            const stockIssueItem = await queryRunner.manager.save(mappedStockIssueItem);
                            return stockIssueItem;
                        })
                    )

                }).then(async (stockIssueItemsList) => {
                    return Promise.all(
                        stockIssueItemsList.map( async (item) => {
                            // const orderItemId = Number(stockIssue.issueType) === StockIssueTypeEnums.NORMAL ?
                            //                         Number(item.orderItem) : Number(item.orderItem.id);

                            const product = await this.orderItemModel.findProduct(item.orderItem.id);

                            return this.adjustmentModel.downAdjustment(
                                product,
                                item.quantityIssued,
                                item.batchNumber, //batch number
                                AdjustmentActionEnums.ISSUE,
                                NEW_ISSUE_REMARK);
                        })
                    )

                })
                .then(async () => {
                    // console.log('committing...');
                    await queryRunner.commitTransaction();
                    return this.findRelatedData(stockIssue.id);
                })

        } catch(err)  {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        }
    }


    async saveEmergencyIssue(order: Order, emergencyItems: JSON[], issueDate: string): Promise<StockIssue> {

        this.transientItems = emergencyItems;

        return this.setUpIssueDTO(order, order.processingOfficer,
            StockIssueTypeEnums.EMERGENCY, issueDate)
            .then(async (createStockIssueDTO: CreateStockIssueDTO) => {
                createStockIssueDTO.items = [];
                const orderItems: OrderItem[] = order.orderItems;

                await orderItems.map(async (orderItem) => {
                    const batchNumber = await this.matchEmergencyItemToBatch(orderItem);

                    const itemObj = {
                        orderItem: orderItem,
                        quantityIssued: orderItem.orderedQuantity,
                        batch_number: batchNumber };
                    const itemJSONString = JSON.stringify(itemObj);
                    const itemJSON = JSON.parse(itemJSONString);
                    createStockIssueDTO.items.push(itemJSON);
                });

                return createStockIssueDTO;

            }).then(async (createStockIssueDTO: CreateStockIssueDTO) => {
                return await this.saveTransaction(createStockIssueDTO);
            })
    }


    async matchEmergencyItemToBatch(orderItem: OrderItem): Promise<string> {
        let index = 0;
        let transientItems = this.transientItems;
        let batchNumber = '';

        for(let i = 0; i < transientItems.length; i++) {
            const transientProduct: number = Number(transientItems[i]['product']);
            const transientQuantity: number = Number(transientItems[i]['quantity']);

            if( transientProduct === orderItem.product.id && transientQuantity === orderItem.orderedQuantity) {
                index = i;
                batchNumber = transientItems[i]['batch_number'];
                break;
            }
        }

        this.transientItems.splice(index, 1);
        return batchNumber;
    }

    async update(id: number, createStockIssueDTO: CreateStockIssueDTO): Promise<StockIssue> {
        const stockIssue: StockIssue = new StockIssueMapper().fromDTO(createStockIssueDTO);
        return this.repository.update(id,  stockIssue)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                // throw new ForbiddenException('My Forbidden');
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }

    async setUpIssueDTO(order: Order, issuingOfficer: User,
                        issueType: number, issueDate: string): Promise<CreateStockIssueDTO> {
        return new StockIssueMapper().toDTO(order, issuingOfficer, issueType, issueDate);
    }
}
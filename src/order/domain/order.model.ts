import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Connection, getConnection, SelectQueryBuilder} from 'typeorm';
import { Repository } from 'typeorm';
import {Order} from "./order.entity";
import {CreateOrderDTO} from "./dto/create.order.dto";
import {OrderMapper} from "./order.mapper";
import { UpdateResult } from  'typeorm';
import {Hospital} from "../../hospital/domain/hospital.entity";
import {User} from "../../user/domain/user.entity";
import {OrderStatus} from "../../order-status/domain/order-status.entity";
import {OrderStatusModel} from "../../order-status/domain/order-status.model";
import {OrderItem} from "../../order-item/domain/order-item.entity";
import {OrderItemModel} from "../../order-item/domain/order-item.model";
import {OrderItemMapper} from "../../order-item/domain/order-item.mapper";
import {ORDER_STATUS_PENDING} from "../../order-status/domain/constants/order-status.constants";
import {BaseModel} from "../../app.basemodel";


@Injectable()
export class OrderModel extends BaseModel{
    constructor(
        @InjectRepository(Order)
        private readonly repository: Repository<Order>,
        private orderStatusModel: OrderStatusModel,
        private orderItemModel: OrderItemModel,
        private connection: Connection = getConnection()
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<Order>> {
        return this.repository
            .createQueryBuilder('order')
            .leftJoinAndSelect("order.hospital", "hospital")
            .leftJoinAndSelect("hospital.location", "location")
            .leftJoinAndSelect("order.processingOfficer", "user")
            .leftJoinAndSelect("order.status", "orderStatus")
            .leftJoinAndSelect("order.orderItems", "orderItem")
            .leftJoinAndSelect("orderItem.product", "product")
            .leftJoinAndSelect("orderItem.stockIssueItem", "stockIssueItem")
            .orderBy('order.id', 'ASC');
    }

    async findAll(options: any={}): Promise<any> {
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
                return OrderModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Order> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findRelatedData(id: number): Promise<Order> {

        const orders: Order[] = await this.repository.find({
            join: {
                alias: 'order',
                innerJoinAndSelect: {
                    orderItem: "order.orderItems",
                    product: "orderItem.product"
                },
            },
            where: {id: id},
        });

        return orders[0];
    }

    async save(createOrderDTO: CreateOrderDTO): Promise<Order> {
        const order: Order = new OrderMapper().fromDTO(createOrderDTO);
        return this.repository.save(order)
            .then(order => order)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async saveTransaction(createOrderDTO: CreateOrderDTO): Promise<any> {
        let order: Order = new OrderMapper().fromDTO(createOrderDTO);
        const itemsList: JSON[] = createOrderDTO.items;

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            return queryRunner.manager.save(order)
                .then(async order => {
                    return order;

                }).then(order => {
                    // const orderItemDTOList: CreateOrderItemDTO[] = [];
                    return Promise.all(
                        itemsList.map(async (item) => {
                            const orderItemDTO = await this.orderItemModel.setUpOrderItemDTO(
                                order, item['product'], item['quantity'])
                            // orderItemDTOList.push(orderItemDTO)
                            return orderItemDTO;
                        })
                    )

                    // return orderItemDTOList;

                }).then(async (orderItemDTOList) => {
                    return Promise.all(
                        orderItemDTOList.map( async (item) => {
                            let mappedOrderItem: OrderItem = new OrderItemMapper().fromDTO(item);
                            let orderItem = queryRunner.manager.save(mappedOrderItem);
                            return orderItem;
                        })
                    )

                }).then(async orderItemsList => {
                    await queryRunner.commitTransaction();
                    const orderId = orderItemsList[0].order.id;
                    return this.findRelatedData(orderId);
                })
        } catch(err)  {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        }
    }


    async update(id: number, createOrderDTO: CreateOrderDTO): Promise<Order> {
        const order: Order = new OrderMapper().fromDTO(createOrderDTO);
        return this.repository.update(id,  order)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }

    async setUpOrderDTO(hospital: Hospital, issuingOfficer: User,
                        status: OrderStatus = null): Promise<CreateOrderDTO> {

        if(status == null)
            status = await this.orderStatusModel.findByAlias(ORDER_STATUS_PENDING);

        return new OrderMapper().toDTO(hospital, issuingOfficer, status);
    }


    async saveUpEmergencyOrder(hospital: Hospital,
                               issuingOfficer: User, items: JSON[]): Promise<Order> {

        return this.setUpOrderDTO(hospital, issuingOfficer)
            .then(createOrderDTO => {
                createOrderDTO.items = items;
                return createOrderDTO;

            }).then(async (createOrderDTO) => {
                return await this.saveTransaction(createOrderDTO);
            })
    }
}
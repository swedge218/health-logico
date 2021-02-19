import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {OrderStatus} from "./order-status.entity";
import {CreateOrderStatusDTO} from "./dto/create.order-status.dto";
import {OrderStatusMapper} from "./order-status.mapper";
import { UpdateResult } from  'typeorm';
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class OrderStatusModel extends BaseModel{
    constructor(
        @InjectRepository(OrderStatus)
        private readonly repository: Repository<OrderStatus>
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<OrderStatus>> {
        return this.repository
            .createQueryBuilder('orderstatus')
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
                return OrderStatusModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<OrderStatus> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findByAlias(alias: string) {
        return this.repository
            .createQueryBuilder('orderStatus')
            .where("alias = :alias", {alias: alias})
            .getOne();
    }

    async save(createOrderStatusDTO: CreateOrderStatusDTO): Promise<OrderStatus> {
        const orderStatus: OrderStatus = new OrderStatusMapper().fromDTO(createOrderStatusDTO);
        return this.repository.save(orderStatus)
            .then(orderStatus => orderStatus)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createOrderStatusDTO: CreateOrderStatusDTO): Promise<OrderStatus> {
        const orderStatus: OrderStatus = new OrderStatusMapper().fromDTO(createOrderStatusDTO);
        return this.repository.update(id,  orderStatus)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }
}
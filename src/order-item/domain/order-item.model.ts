import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {OrderItem} from "./order-item.entity";
import {CreateOrderItemDTO} from "./dto/create.order-item.dto";
import {OrderItemMapper} from "./order-item.mapper";
import { UpdateResult } from  'typeorm';
import {Order} from "../../order/domain/order.entity";
import {Product} from "../../product/domain/product.entity";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class OrderItemModel extends BaseModel{
    constructor(
        @InjectRepository(OrderItem)
        private readonly repository: Repository<OrderItem>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<OrderItem>> {
        return this.repository
            .createQueryBuilder('orderItem')
            .leftJoinAndSelect("orderItem.order", "order")
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
                return OrderItemModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<OrderItem> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findProduct(id: number): Promise<Product> {
        return this.findOne(id)
            .then(item => {
                if(item !== undefined)
                    return item.product
                else
                    throw new NotFoundException('Order Item Not Found');
            })
            .catch((e: InternalServerErrorException) => {
                throw new InternalServerErrorException(e);
            })
    }

    async save(createOrderItemDTO: CreateOrderItemDTO): Promise<OrderItem> {
        const orderItem: OrderItem = new OrderItemMapper().fromDTO(createOrderItemDTO);
        return this.repository.save(orderItem)
            .then(orderItem => orderItem)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createOrderItemDTO: CreateOrderItemDTO): Promise<OrderItem> {
        const orderItem: OrderItem = new OrderItemMapper().fromDTO(createOrderItemDTO);
        return this.repository.update(id,  orderItem)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }

    async setUpOrderItemDTO(order: Order, product: Product,
                      orderedQuantity: number): Promise<CreateOrderItemDTO> {
        return new OrderItemMapper().toDTO(order, product, orderedQuantity);
    }
}
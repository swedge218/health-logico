import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {OrderItemService} from "./order-item.service";
import {OrderItem} from "./domain/order-item.entity";
import {CreateOrderItemDTO} from "./domain/dto/create.order-item.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('order-items')
export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService){}

    @RequiredPermissions(PermissionsEnum.VIEW_ORDER)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.orderItemService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_ORDER)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderItem> {
        return this.orderItemService.findOne(id)
            .then(orderItem => {
                return ResponseBuilder.makeFindResponder(orderItem);
            });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_ORDER)
    @Get(':id/product')
    async findProduct(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.orderItemService.findProduct(id)
            .then(product => {
                return ResponseBuilder.makeFindResponder(product);
            });
    }

    @Closed()
    @Post()
    async create(@Body() createOrderItemDTO: CreateOrderItemDTO) {
        return this.orderItemService.create(createOrderItemDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_ORDER)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createOrderItemDTO: CreateOrderItemDTO): Promise<OrderItem> {
        return this.orderItemService.update(id,  createOrderItemDTO);
    }

    @Closed()
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.orderItemService.remove(id);
    }
}

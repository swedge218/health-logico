import {Body, Controller, Delete, Get, Injectable, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {OrderStatusService} from "./order-status.service";
import {OrderStatus} from "./domain/order-status.entity";
import {CreateOrderStatusDTO} from "./domain/dto/create.order-status.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('order-status')
@Injectable()
export class OrderStatusController {
    constructor(private readonly orderStatusService: OrderStatusService){}

    @RequiredPermissions(PermissionsEnum.VIEW_ORDER_STATUS)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.orderStatusService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_ORDER_STATUS)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderStatus> {
        return this.orderStatusService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });

    }

    @RequiredPermissions(PermissionsEnum.CREATE_ORDER_STATUS)
    @Post()
    async create(@Body() createOrderStatusDTO: CreateOrderStatusDTO) {
        return this.orderStatusService.create(createOrderStatusDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_ORDER_STATUS)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createOrderStatusDTO: CreateOrderStatusDTO): Promise<OrderStatus> {
        return this.orderStatusService.update(id,  createOrderStatusDTO);
    }

    @RequiredPermissions(PermissionsEnum.DELETE_ORDER_STATUS)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.orderStatusService.remove(id);
    }
}

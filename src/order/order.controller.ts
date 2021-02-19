import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {Injectable} from '@nestjs/common';
import {OrderService} from "./order.service";
import {Order} from "./domain/order.entity";
import {CreateOrderDTO} from "./domain/dto/create.order.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('order')
@Injectable()
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @RequiredPermissions(PermissionsEnum.VIEW_ORDER)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.orderService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_ORDER)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
        return this.orderService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @Closed()
    @Get('find-related/:id')
    async findRelated(@Param('id', ParseIntPipe) id: number): Promise<Order> {
        return this.orderService.findRelated(id);
    }

    @RequiredPermissions(PermissionsEnum.CREATE_ORDER)
    @Post()
    async create(@Body() createOrderDTO: CreateOrderDTO) {
        return this.orderService.create(createOrderDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_ORDER)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createOrderDTO: CreateOrderDTO): Promise<Order> {

        return this.orderService.update(id, createOrderDTO)
    }

    @Closed()
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.orderService.remove(id);
    }
}

import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {DeliveryStatusService} from "./delivery-status.service";
import {CreateDeliveryStatusDTO} from "./domain/dto/create-delivery-status.dto";
import {DeliveryStatus} from "./domain/delivery-status.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('delivery-status')
export class DeliveryStatusController {
    constructor(private readonly deliveryStatusService: DeliveryStatusService){}

    @RequiredPermissions(PermissionsEnum.VIEW_DELIVERY_STATUS)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.deliveryStatusService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_DELIVERY_STATUS)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<DeliveryStatus> {
        return this.deliveryStatusService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.CREATE_DELIVERY_STATUS)
    @Post()
    async create(@Body() createDeliveryStatusDTO: CreateDeliveryStatusDTO) {
        return this.deliveryStatusService.create(createDeliveryStatusDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_DELIVERY_STATUS)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createDeliveryStatusDTO: CreateDeliveryStatusDTO): Promise<DeliveryStatus> {
        return this.deliveryStatusService.update(id,  createDeliveryStatusDTO);
    }

    @RequiredPermissions(PermissionsEnum.DELETE_DELIVERY_STATUS)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.deliveryStatusService.remove(id);
    }
}
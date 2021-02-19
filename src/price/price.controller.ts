import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {PriceService} from "./price.service";
import {CreatePriceDTO} from "./domain/dto/create-price.dto";
import {Price} from "./domain/price.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('price')
export class PriceController {
    constructor(private readonly priceService: PriceService){}

    @RequiredPermissions(PermissionsEnum.VIEW_PRICE)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.priceService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }


    @RequiredPermissions(PermissionsEnum.VIEW_PRICE)
    @Get('/notset')
    async findAllNoPrice(
        @Req() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10): Promise<any> {

        return this.priceService.findAllNoPrice({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PRICE)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Price> {
        return this.priceService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PRICE)
    @Get('/product/:pId/batch/:batch')
    async findPrice(@Param('pId') productId: number, @Param('batch') batchNumber: string): Promise<number> {
        return this.priceService.findPrice(productId, batchNumber)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @Closed()
    @Get('find-related-data/:id')
    async findRelatedData(@Param('id') id: number): Promise<Price> {
        return this.priceService.findRelatedData(id);
    }

    @Closed()
    @Post()
    async create(@Body() createPriceDTO: CreatePriceDTO) {
        return this.priceService.create(createPriceDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_PRICE)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createPriceDTO: CreatePriceDTO): Promise<Price> {
        return this.priceService.update(id,  createPriceDTO);
    }

    @Closed()
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.priceService.remove(id);
    }
}
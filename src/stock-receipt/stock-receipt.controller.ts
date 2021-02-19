import {Controller, Get, Post, Param, Body, Put, Delete, Req, Query} from '@nestjs/common';
import {ParseIntPipe} from "@nestjs/common";
import { Injectable } from '@nestjs/common';
import {StockReceiptService} from "./stock-receipt.service";
import {StockReceipt} from "./domain/stock-receipt.entity";
import {CreateStockReceiptDTO} from "./domain/dto/create-stock-receipt.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('stock-receipt')
@Injectable()
export class StockReceiptController {
    constructor(private readonly stockReceiptService: StockReceiptService){}

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_RECEIPT)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.stockReceiptService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_RECEIPT)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<StockReceipt> {
        return this.stockReceiptService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @Closed()
    @Get('find-related-data/:id')
    async findRelatedData(@Param('id', ParseIntPipe) id: number): Promise<StockReceipt> {
        return this.stockReceiptService.findRelatedData(id);
    }

    @RequiredPermissions(PermissionsEnum.CREATE_STOCK_RECEIPT)
    @Post()
    async create(@Body() createStockReceiptDTO: CreateStockReceiptDTO) {
        return this.stockReceiptService.create(createStockReceiptDTO);
    }

    @Closed()
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createStockReceiptDTO: CreateStockReceiptDTO): Promise<StockReceipt> {
        return this.stockReceiptService.update(id,  createStockReceiptDTO);
    }

    @Closed()
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.stockReceiptService.remove(id);
    }
}

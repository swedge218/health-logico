import {Controller, Get, Post, Param, Body, Put, Delete, Req, Query} from '@nestjs/common';
import {ParseIntPipe} from "@nestjs/common";
import { Injectable } from '@nestjs/common';
import {StockReceiptItemService} from "./stock-receipt-item.service";
import {StockReceiptItem} from "./domain/stock-receipt-item.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('stock-receipt-item')
@Injectable()
export class StockReceiptItemController {
    constructor(private readonly stockReceiptItemService: StockReceiptItemService){}

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_RECEIPT)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.stockReceiptItemService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_RECEIPT)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<StockReceiptItem> {
        return this.stockReceiptItemService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_RECEIPT)
    @Get(':id/product')
    async findItemProduct(@Param('id', ParseIntPipe) id: number): Promise<StockReceiptItem> {
        return this.stockReceiptItemService.findOrderItem(id);
    }

    // @Post()
    // async create(@Body() createStockReceiptItemDTO: CreateStockReceiptItemDTO) {
    //     return this.stockReceiptItemService.create(createStockReceiptItemDTO);
    // }

    // @Put(':id')
    // async update(@Param('id') id: number,
    //              @Body() createStockReceiptItemDTO: CreateStockReceiptItemDTO): Promise<StockReceiptItem> {
    //     return this.stockReceiptItemService.update(id,  createStockReceiptItemDTO);
    // }

    // @Delete(':id')
    // async remove(@Param('id') id: number): Promise<any> {
    //     return this.stockReceiptItemService.remove(id);
    // }
}
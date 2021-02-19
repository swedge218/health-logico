import {Controller, Get, Post, Param, Body, Put, Delete, Req, Query} from '@nestjs/common';
import {ParseIntPipe} from "@nestjs/common";
import { Injectable } from '@nestjs/common';
import {StockIssueItemService} from "./stock-issue-item.service";
import {StockIssueItem} from "./domain/stock-issue-item.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('stock-issue-item')
@Injectable()
export class StockIssueItemController {
    constructor(private readonly stockIssueItemService: StockIssueItemService){}

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_ISSUE)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.stockIssueItemService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_ISSUE)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<StockIssueItem> {
        return this.stockIssueItemService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    // @Post()
    // async create(@Body() createStockIssueItemDTO: CreateStockIssueItemDTO) {
    //     return this.stockIssueItemService.create(createStockIssueItemDTO);
    // }

    // @Put(':id')
    // async update(@Param('id') id: number,
    //              @Body() createStockIssueItemDTO: CreateStockIssueItemDTO): Promise<StockIssueItem> {
    //     return this.stockIssueItemService.update(id,  createStockIssueItemDTO);
    // }
    //
    // @Delete(':id')
    // async remove(@Param('id') id: number): Promise<any> {
    //     return this.stockIssueItemService.remove(id);
    // }
}

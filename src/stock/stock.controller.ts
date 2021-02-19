import {Controller, Get, Param, ParseIntPipe, Query, Req} from '@nestjs/common';
import {StockService} from "./stock.service";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('stock')
export class StockController {
    constructor(private readonly stockService: StockService){}

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.stockService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK)
    @Get('/product-stock/product/:pId/hospital/:hId?')
    async findProductStock(
        @Req() req,
        @Param('pId') productId: number,
        @Param('hId') hospitalId: number,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.stockService.findProductStock( productId, hospitalId, {
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK)
    @Get('/product-stock-aggs/product/:pId/hospital/:hId?')
    async findProductStockAggs(
        @Req() req,
        @Param('pId') productId: number,
        @Param('hId') hospitalId: number,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.stockService.findProductStockAggs( productId, hospitalId, {
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK)
    @Get('stocked/product/:pId/batch/:batch/hospital/:hid')
    async findOne(@Param('pId') productId: number, @Param('batch') batchNumber,
                  @Param('hid') hospitalId: number): Promise<any> {
        return this.stockService.facilityHasProductRegistered(productId, batchNumber, hospitalId)
            .then(stock => {
                return ResponseBuilder.makeFindResponder(stock);
            })
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK)
    @Get('find/product/:pId/batch/:batch/hospital/:hid')
    async findStock(@Param('pId') productId: number, @Param('batch') batchNumber,
                  @Param('hid') hospitalId: number): Promise<any> {
        return this.stockService.findStock(productId, batchNumber, hospitalId)
            .then(stock => {
                return ResponseBuilder.makeFindResponder(stock);
            })
    }

}
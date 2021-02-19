import {Body, Controller, Get, Param, Post, Put, Query, Req} from '@nestjs/common';
import {ReportsService} from "../services/reports.service";
import {DateFilterDTO} from "../domain/dto/date-filter.dto";
import {ProductFilterDTO} from "../domain/dto/product-filter.dto";

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService){}

    // @Get('/home-data')
    // async findHomeDataPoints(
    //     @Req() req,
    //     @Query('page') page: number = 1,
    //     @Query('limit') limit: number = 10): Promise<any> {
    //
    //     return this.reportsService.findHomeDataPoints({
    //         page: page,
    //         limit: limit,
    //         path: req.path
    //     });
    // }

    @Get('/home-data')
    async findHomeDataPoints(): Promise<any> {
        return this.reportsService.findHomeDataPoints();
    }

    @Get('/home-totals')
    async findHomeSummaries(@Body() dateFilterDTO: DateFilterDTO): Promise<any> {
        return this.reportsService.findHomeSummaries(dateFilterDTO);
    }

    @Get('/home-stock/:pId?')
    async findHomeStock(@Param('pId') pId?: number): Promise<any> {
        return this.reportsService.findStock(pId);
    }

    @Get('/home-volumes')
    async findSalesQuantityVolumes(
        @Body() dateFilterDTO: DateFilterDTO,
        @Body() productFilterDTO: ProductFilterDTO): Promise<any> {

        return this.reportsService.findSalesQuantityVolumes(dateFilterDTO, productFilterDTO);
    }
}
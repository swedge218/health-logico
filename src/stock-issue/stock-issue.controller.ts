import {Controller, Get, Post, Param, Body, Put, Delete, Req, Query, Optional} from '@nestjs/common';
import {ParseIntPipe} from "@nestjs/common";
import {StockIssueService} from "./stock-issue.service";
import {StockIssue} from "../stock-issue/domain/stock-issue.entity";
import {CreateStockIssueDTO} from "./domain/dto/create-stock-issue.dto";
import {CreateEmergencyStockIssueDTO} from "./domain/dto/create-issue-emergency.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('stock-issue')
export class StockIssueController {
    constructor(private readonly stockIssueService: StockIssueService){}

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_ISSUE)
    @Get()
    async findAll(
        @Req() req,
        @Query('status') status: string,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.stockIssueService.findAll({
            page, limit, status, path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_ISSUE)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<StockIssue> {
        return this.stockIssueService.findOne(id)
            .then(stockIssue => {
                return ResponseBuilder.makeFindResponder(stockIssue);
            });
    }


    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_ISSUE)
    @Get('/hospital/:hId')
    async findHospitalIssues(@Param('hId', ParseIntPipe) hospitalId: number): Promise<any[]> {
        return this.stockIssueService.findHospitalIssues(hospitalId)
            .then(stockIssue => {
                return ResponseBuilder.makeFindResponder(stockIssue);
            });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_STOCK_ISSUE)
    @Get('/types/:id')
    async findTypes(@Param('id') id: number): Promise<any> {
        return this.stockIssueService.findIssueTypes();
    }

    @RequiredPermissions(PermissionsEnum.CREATE_STOCK_ISSUE)
    @Post()
    async create(@Body() createStockIssueDTO: CreateStockIssueDTO) {
        return this.stockIssueService.create(createStockIssueDTO);
    }

    @RequiredPermissions(PermissionsEnum.CREATE_STOCK_ISSUE)
    @Post('emergency')
    async createEmergency(@Body() stockIssueDTO: CreateEmergencyStockIssueDTO) {
        // console.log('eme createStockIssueDTO', createStockIssueDTO);
        return this.stockIssueService.createEmergency(stockIssueDTO);
    }

    @Closed()
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createStockIssueDTO: CreateStockIssueDTO): Promise<StockIssue> {
        return this.stockIssueService.update(id,  createStockIssueDTO);
    }

    @Closed()
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.stockIssueService.remove(id);
    }
}

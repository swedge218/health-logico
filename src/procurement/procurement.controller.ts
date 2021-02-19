import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {ProcurementService} from "./procurement.service";
import {CreateProcurementDTO} from "./domain/dto/create-procurement.dto";
import {Procurement} from "./domain/procurement.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('procurement')
export class ProcurementController {
    constructor(private readonly procurementService: ProcurementService){}

    @RequiredPermissions(PermissionsEnum.VIEW_PROCUREMENT)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.procurementService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PROCUREMENT)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Procurement> {
        console.log('controller')
        return this.procurementService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @Closed()
    @Get('find-related-data/:id')
    async findRelatedData(@Param('id') id: number): Promise<Procurement> {
        return this.procurementService.findRelatedData(id);
    }

    @RequiredPermissions(PermissionsEnum.CREATE_PROCUREMENT)
    @Post()
    async create(@Body() createProcurementDTO: CreateProcurementDTO) {
        return this.procurementService.create(createProcurementDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_PROCUREMENT)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createProcurementDTO: CreateProcurementDTO): Promise<Procurement> {
        return this.procurementService.update(id,  createProcurementDTO);
    }
}
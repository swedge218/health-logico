import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {ProcurementItemService} from "./procurement-item.service";
import {CreateProcurementItemDTO} from "./domain/dto/create-procurement-item.dto";
import {ProcurementItem} from "./domain/procurement-item.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('procurement-item')
export class ProcurementItemController {
    constructor(private readonly procurementItemService: ProcurementItemService){}

    @RequiredPermissions(PermissionsEnum.VIEW_PROCUREMENT)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10): Promise<any> {

        return this.procurementItemService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PROCUREMENT)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<ProcurementItem> {
        return this.procurementItemService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PROCUREMENT)
    @Get('/product/:id')
    async findByProductId(@Param('id') id: number): Promise<ProcurementItem> {
        return this.procurementItemService.findOneByProductId(id)
    }

    @Closed()
    @Post()
    async create(@Body() createProcurementItemDTO: CreateProcurementItemDTO) {
        return this.procurementItemService.create(createProcurementItemDTO);
    }

    // @Put(':id')
    // async update(@Param('id') id: number,
    //              @Body() createProcurementItemDTO: CreateProcurementItemDTO): Promise<ProcurementItem> {
    //     return this.procurementItemService.update(id,  createProcurementItemDTO);
    // }
    //
    // @Delete(':id')
    // async remove(@Param('id') id: number): Promise<any> {
    //     return this.procurementItemService.remove(id);
    // }
}
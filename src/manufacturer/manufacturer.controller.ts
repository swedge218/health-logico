import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {ManufacturerService} from "./manufacturer.service";
import {CreateManufacturerDTO} from "./domain/dto/create.manufacturer.dto";
import {Manufacturer} from "./domain/manufacturer.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('manufacturers')
export class ManufacturerController {
    constructor(private readonly manufacturerService: ManufacturerService){}

    @RequiredPermissions(PermissionsEnum.VIEW_MANNUFACTURER)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number ,
        @Query('limit') limit: number): Promise<any> {

        return this.manufacturerService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_MANNUFACTURER)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Manufacturer> {
        return this.manufacturerService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.CREATE_MANNUFACTURER)
    @Post()
    async create(@Body() createManufacturerDTO: CreateManufacturerDTO) {
        return this.manufacturerService.create(createManufacturerDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_MANNUFACTURER)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createManufacturerDTO: CreateManufacturerDTO): Promise<Manufacturer> {
        return this.manufacturerService.update(id,  createManufacturerDTO);
    }

    @RequiredPermissions(PermissionsEnum.DELETE_MANNUFACTURER)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.manufacturerService.remove(id);
    }
}

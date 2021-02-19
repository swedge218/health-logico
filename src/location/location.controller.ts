import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {LocationService} from "./location.service";
import {Location} from "./domain/location.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService){}

    @RequiredPermissions(PermissionsEnum.VIEW_LOCATION)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number ,
        @Query('limit') limit: number): Promise<any> {

        return this.locationService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_INVOICE)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Location> {
        return this.locationService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }
}
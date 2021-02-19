import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req} from '@nestjs/common';
import { CreatePermissionDTO } from './domain/dto/create-permission.dto';
import { Permission } from './domain/permission.entity';
import { PermissionService } from './permission.service';
import {ResponseBuilder} from "../utils/ResponseBuilder";

@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.permissionService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Permission> {
        return this.permissionService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @Post()
    create(@Body() createPermissionDTO: CreatePermissionDTO): Promise<Permission> {
        return this.permissionService.create(createPermissionDTO);
    }

    @Put(':id')
    update(@Param('id') id: number,
           @Body() createPermissionDTO: CreatePermissionDTO): Promise<any> {
        return this.permissionService.update(id,  createPermissionDTO);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<any> {
        return this.permissionService.remove(id);
    }
}
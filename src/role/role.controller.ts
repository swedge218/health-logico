import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req} from '@nestjs/common';
import { CreateRoleDTO } from './domain/dto/create-role.dto';
import { Role } from './domain/role.entity';
import { RoleService } from './role.service';
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";
import {Public} from "../auth/decorators/public.decorator";

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @RequiredPermissions(PermissionsEnum.VIEW_ROLE)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.roleService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_ROLE)
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Role> {
        return this.roleService.findOne(id)
            .then(role => {
                return ResponseBuilder.makeFindResponder(role);
            })
    }

    @RequiredPermissions(PermissionsEnum.VIEW_ROLE)
    @Get('/permissions/:id')
    async findPermissions(@Param('id') id: number): Promise<Role> {
        return this.roleService.findPermissions(id)
            .then(role => {
                return ResponseBuilder.makeFindResponder(role);
            })
    }

    @RequiredPermissions(PermissionsEnum.CREATE_ROLE)
    @Post()
    create(@Body() createRoleDTO: CreateRoleDTO): Promise<Role> {
        return this.roleService.create(createRoleDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_ROLE)
    @Put(':id')
    update(@Param('id') id: number,
           @Body() createRoleDTO: CreateRoleDTO): Promise<any> {
        return this.roleService.update(id,  createRoleDTO);
    }

    @Closed()
    @Delete(':id')
    remove(@Param('id') id: number): Promise<any> {
        return this.roleService.remove(id);
    }
}
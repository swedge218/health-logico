import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDTO} from "./domain/dto/create.user.dto";
import {User} from "./domain/user.entity";
import {UserStatusDTO} from "./domain/dto/user.status.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {UpdateUserDTO} from "./domain/dto/update.user.dto";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService){}

    @RequiredPermissions(PermissionsEnum.VIEW_USER)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.userService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_USER)
    @Get('disabled')
    async findAllDisabled(
        @Req() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10): Promise<any> {

        return this.userService.findAllDisabled({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_USER)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id)
            .then(user => {
                return ResponseBuilder.makeFindResponder(user);
            });
    }

    @RequiredPermissions(PermissionsEnum.CREATE_USER)
    @Post()
    async create(@Body() createUserDTO: CreateUserDTO) {
        return this.userService.create(createUserDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_USER)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() updateUserDTO: UpdateUserDTO): Promise<User> {
        return this.userService.update(id,  updateUserDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_USER)
    @Put('/change-password/:id')
    async changePassword(@Param('id') id: number,
                 @Body() passwordObj: any): Promise<string> {
        return this.userService.changePassword(id,  passwordObj);
    }

    @RequiredPermissions(PermissionsEnum.BLOCK_USER)
    @Put('/block/:id')
    async block(@Param('id') id: number, @Body() userStatusDTO: UserStatusDTO): Promise<string> {
        return this.userService.block(id,  userStatusDTO);
    }
}
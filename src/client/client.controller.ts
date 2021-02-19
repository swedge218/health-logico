import {
    Body,
    Controller,
    Delete,
    Get, Headers,
    Injectable,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Req
} from '@nestjs/common';
import {ClientService} from "./client.service";
import {Client} from "../client/domain/client.entity";
import {CreateClientDTO} from "./domain/dto/create.client.dto";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Public} from "../auth/decorators/public.decorator";
import {BlockClientDTO} from "./domain/dto/block.client.dto";
import {ClientAuthDTO} from "./domain/dto/client.auth.dto";
import {RequestHeader} from "../validators/header.variable.validator";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('client')
@Injectable()
export class ClientController {
    constructor(private readonly clientService: ClientService){}

    @RequiredPermissions(PermissionsEnum.VIEW_CLIENT)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.clientService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_CLIENT)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Client> {
        return this.clientService.findOne(id);
    }

    @RequiredPermissions(PermissionsEnum.CREATE_CLIENT)
    @Post()
    async create(@Body() createClientDTO: CreateClientDTO) {
        return this.clientService.create(createClientDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_CLIENT)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createClientDTO: CreateClientDTO): Promise<Client> {
        return this.clientService.update(id,  createClientDTO);
    }

    @Closed()
    @Post('/secret/generate')
    async generateKey(): Promise<string> {
        return this.clientService.generateKey();
    }


    @RequiredPermissions(PermissionsEnum.RESET_CLIENT_KEY)
    @Patch('/secret/reset/:id')
    async resetKey(@Param('id') id: number): Promise<string> {
        return this.clientService.resetKey(id);
    }


    @RequiredPermissions(PermissionsEnum.BLOCK_CLIENT)
    @Patch('/status/:id')
    async changeStatus(@Param('id') id: number, @Body() blockClientDTO: BlockClientDTO): Promise<any> {
        return this.clientService.changeStatus(id, blockClientDTO);
    }

    @Public()
    @Post('/secret/auth')
    async testSecretAuth(@RequestHeader(ClientAuthDTO) clientAuthDTO: ClientAuthDTO): Promise<string> {
        console.log(clientAuthDTO);
        return this.clientService.generateKey();
    }
}

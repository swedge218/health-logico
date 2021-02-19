import {Body, Controller, Delete, Get, Injectable, Param, Post, Put, Query, Req} from '@nestjs/common';
import { CreateInvoiceItemDTO } from './domain/dto/create-invoice-item.dto';
import { InvoiceItem } from './domain/invoice-item.entity';
import { InvoiceItemService } from './invoice-item.service';
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('invoice-item')
@Injectable()
export class InvoiceItemController {
    constructor(private readonly invoiceItemService: InvoiceItemService) {}

    @RequiredPermissions(PermissionsEnum.VIEW_INVOICE)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.invoiceItemService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_INVOICE)
    @Get(':id')
    findOne(@Param('id') id: number): Promise<InvoiceItem> {
        return this.invoiceItemService.findOne(id)
            .then(invoiceItem => {
                return ResponseBuilder.makeFindResponder(invoiceItem);
            })
    }

    @Closed()
    @Post()
    create(@Body() createInvoiceItemDTO: CreateInvoiceItemDTO): Promise<InvoiceItem> {
        return this.invoiceItemService.create(createInvoiceItemDTO);
    }

    @Closed()
    @Put(':id')
    update(@Param('id') id: number,
           @Body() createInvoiceItemDTO: CreateInvoiceItemDTO): Promise<any> {
        return this.invoiceItemService.update(id,  createInvoiceItemDTO);
    }

    @Closed()
    @Delete(':id')
    remove(@Param('id') id: number): Promise<any> {
        return this.invoiceItemService.remove(id);
    }
}
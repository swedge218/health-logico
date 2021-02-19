import {Body, Controller, Delete, Get, Injectable, Param, Post, Put, Query, Req} from '@nestjs/common';
import { CreateInvoiceDTO } from './domain/dto/create-invoice.dto';
import { Invoice } from './domain/invoice.entity';
import { InvoiceService } from './invoice.service';
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('invoice')
@Injectable()
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @RequiredPermissions(PermissionsEnum.VIEW_INVOICE)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.invoiceService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_INVOICE)
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Invoice> {
        return this.invoiceService.findOne(id)
            .then(invoice => {
                return ResponseBuilder.makeFindResponder(invoice);
            })
    }

    @RequiredPermissions(PermissionsEnum.VIEW_HOSPITAL)
    @Get('/summary/:invoicenumber')
    findSummary(@Param('invoicenumber') invoicenumber: string): Promise<any[]> {
        return this.invoiceService.findSummary(invoicenumber)
            .then(summary => {
                return ResponseBuilder.makeFindResponder(summary);
            })
    }

    @RequiredPermissions(PermissionsEnum.CREATE_INVOICE)
    @Post()
    create(@Body() createInvoiceDTO: CreateInvoiceDTO): Promise<Invoice> {
        return this.invoiceService.create(createInvoiceDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_INVOICE)
    @Put(':id')
    update(@Param('id') id: number,
           @Body() createInvoiceDTO: CreateInvoiceDTO): Promise<any> {
        return this.invoiceService.update(id,  createInvoiceDTO);
    }

    @Closed()
    @Delete(':id')
    remove(@Param('id') id: number): Promise<any> {
        return this.invoiceService.remove(id);
    }
}
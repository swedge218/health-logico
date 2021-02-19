import { Injectable } from '@nestjs/common';
import { CreateInvoiceItemDTO } from './domain/dto/create-invoice-item.dto';
import { InvoiceItem } from './domain/invoice-item.entity';
import { DeleteResult } from  'typeorm';
import {InvoiceItemModel} from "./domain/invoice-item.model";

@Injectable()
export class InvoiceItemService {

    constructor (
        private invoiceItemModel: InvoiceItemModel
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.invoiceItemModel.findAll(options);
    }

    async findOne(id: number): Promise<InvoiceItem> {
        return this.invoiceItemModel.findOne(id);
    }

    async create(createInvoiceItemDTO: CreateInvoiceItemDTO): Promise<InvoiceItem> {
        return this.invoiceItemModel.save(createInvoiceItemDTO);
    }

    async update(id: number, createInvoiceItemDTO: CreateInvoiceItemDTO): Promise<InvoiceItem> {
        return this.invoiceItemModel.update(id,  createInvoiceItemDTO);
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.invoiceItemModel.remove(id);
    }
}
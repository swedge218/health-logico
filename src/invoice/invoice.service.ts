import { Injectable } from '@nestjs/common';
import { CreateInvoiceDTO } from './domain/dto/create-invoice.dto';
import { Invoice } from './domain/invoice.entity';
import { DeleteResult } from  'typeorm';
import {InvoiceModel} from "./domain/invoice.model";

@Injectable()
export class InvoiceService {

    constructor (
        private invoiceModel: InvoiceModel
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.invoiceModel.findAll(options);
    }

    async findOne(id: number): Promise<Invoice> {
        return this.invoiceModel.findOne(id);
    }

    async findSummary(invoiceNumber: string): Promise<any[]> {
        return this.invoiceModel.findSummary(invoiceNumber);
    }

    async create(createInvoiceDTO: CreateInvoiceDTO): Promise<Invoice> {
        return this.invoiceModel.save(createInvoiceDTO);
    }

    async update(id: number, createInvoiceDTO: CreateInvoiceDTO): Promise<Invoice> {
        return this.findOne(id)
            .then(invoice => {
                return this.invoiceModel.update(invoice, createInvoiceDTO);
            })

    }

    async remove(id: number): Promise<DeleteResult> {
        return this.invoiceModel.remove(id);
    }
}
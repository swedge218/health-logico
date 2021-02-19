import {InvoiceItem} from "./invoice-item.entity";
import {CreateInvoiceItemDTO} from "./dto/create-invoice-item.dto";
import {Product} from "../../product/domain/product.entity";
import {Invoice} from "../../invoice/domain/invoice.entity";

export class InvoiceItemMapper {
    fromDTO(dto: CreateInvoiceItemDTO):InvoiceItem {
        const invoiceItem: InvoiceItem = new InvoiceItem();

        invoiceItem.invoice = dto.invoice;
        invoiceItem.product = dto.product;
        invoiceItem.batchNumber = dto.batchNumber;
        invoiceItem.unitCost = dto.unitCost;
        invoiceItem.quantity = dto.quantity;
        invoiceItem.amount = dto.amount;

        return invoiceItem;
    }

    toDTO(invoice: Invoice, product: Product, batchNumber: string ,
          unitCost: number, quantity: number, amount: number):CreateInvoiceItemDTO {
        const dto: CreateInvoiceItemDTO = new CreateInvoiceItemDTO();

        dto.invoice = invoice;
        dto.product = product;
        dto.batchNumber = batchNumber;
        dto.unitCost = unitCost;
        dto.quantity = quantity;
        dto.amount = amount;

        return dto;
    }
}
import {Invoice} from "./invoice.entity";
import {CreateInvoiceDTO} from "./dto/create-invoice.dto";

export class InvoiceMapper {
    fromDTO(dto: CreateInvoiceDTO):Invoice {
        const invoice: Invoice = new Invoice();

        invoice.hospital = dto.hospital;
        invoice.saleOfficer = dto.saleOfficer;

        return invoice;
    }

    updateInvoice(invoice: Invoice, dto:CreateInvoiceDTO): Invoice {
        invoice.hospital = dto.hospital;
        invoice.saleOfficer = dto.saleOfficer;
        return invoice;
    }
}
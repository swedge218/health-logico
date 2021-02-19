import {ProcurementItem} from "./procurement-item.entity";
import {CreateProcurementItemDTO} from "./dto/create-procurement-item.dto";
import {Procurement} from "../../procurement/domain/procurement.entity";
import {Product} from "../../product/domain/product.entity";

export class ProcurementItemMapper{
    fromDTO(dto: CreateProcurementItemDTO):ProcurementItem {
        const procurementItem: ProcurementItem = new ProcurementItem();

        procurementItem.batchNumber = dto.batchNumber;
        procurementItem.expiryDate = dto.expiryDate;
        procurementItem.quantityReceived = dto.quantityReceived;
        procurementItem.product = dto.product;
        procurementItem.procurement = dto.procurement;

        return procurementItem;
    }


    toDTO(procurement: Procurement, product: Product,
          quantityReceived: number, batchNumber: string,
          expiryDate: string):CreateProcurementItemDTO {

        const dto: CreateProcurementItemDTO = new CreateProcurementItemDTO();

        dto.batchNumber = batchNumber;
        dto.expiryDate = expiryDate;
        dto.quantityReceived = quantityReceived;
        dto.product = product;
        dto.procurement = procurement;

        return dto;
    }
}
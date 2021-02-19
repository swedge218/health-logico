import {Adjustment} from "./adjustment.entity";
import {CreateAdjustmentDTO} from "./dto/create-adjustment.dto";
import {Product} from "../../product/domain/product.entity";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {AdjustmentActionEnums, AdjustmentTypeEnums} from "./enums/adjustment.type.enums";

export class AdjustmentMapper{
    fromDTO(dto: CreateAdjustmentDTO):Adjustment {
        const adjustment: Adjustment = new Adjustment();

        adjustment.product = dto.product;
        adjustment.adjustmentType = dto.adjustmentType;
        adjustment.adjustmentAction = dto.adjustmentAction;
        adjustment.quantity = dto.quantity;
        adjustment.batchNumber = dto.batchNumber;
        adjustment.remarks = dto.remarks;
        adjustment.hospital = dto.hospital;

        return adjustment;
    }

    toDTO(product: Product, quantity: number, batchNumber: string,
          adjustmentType: AdjustmentTypeEnums, adjustmentAction: AdjustmentActionEnums, remarks: string,
          hospital: Hospital): CreateAdjustmentDTO {

        const createAdjustmentDTO: CreateAdjustmentDTO = new CreateAdjustmentDTO();
        createAdjustmentDTO.product = product;
        createAdjustmentDTO.quantity = quantity;
        createAdjustmentDTO.batchNumber = batchNumber;
        createAdjustmentDTO.adjustmentType = adjustmentType;
        createAdjustmentDTO.adjustmentAction = adjustmentAction;
        createAdjustmentDTO.remarks = remarks;
        createAdjustmentDTO.hospital = hospital;

        return createAdjustmentDTO;
    }
}
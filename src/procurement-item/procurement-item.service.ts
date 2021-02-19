import {Injectable} from '@nestjs/common';
import {ProcurementItemModel} from "./domain/procurement-item.model";
import {ProcurementItem} from "./domain/procurement-item.entity";
import {CreateProcurementItemDTO} from "./domain/dto/create-procurement-item.dto";
import {AdjustmentService} from "../adjustment/adjustment.service";
import {NEW_PROCUREMENT_REMARK} from "./domain/constants/procurement-item.constants";
import {AdjustmentActionEnums} from "../adjustment/domain/enums/adjustment.type.enums";


@Injectable()
export class ProcurementItemService {

    constructor(
        private procurementItemModel: ProcurementItemModel,
        private adjustmentService: AdjustmentService
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.procurementItemModel.findAll(options);
    }

    async findOne(id: number): Promise<ProcurementItem> {
        return this.procurementItemModel.findOne(id);
    }

    async findOneByProductId(id: number): Promise<ProcurementItem> {
        return this.procurementItemModel.findOneByProductId(id);
    }

    async create(createProcurementItemDTO: CreateProcurementItemDTO): Promise<ProcurementItem> {
        return this.procurementItemModel.save(createProcurementItemDTO)
            .then(item => {
                this.adjustmentService.upAdjustment(
                    item.product,
                    item.quantityReceived,
                    item.batchNumber,
                    AdjustmentActionEnums.PROCUREMENT,
                    NEW_PROCUREMENT_REMARK);
                return item;
            });
    }

    // async update(id: number, createProcurementItemDTO: CreateProcurementItemDTO): Promise<ProcurementItem> {
    //     return this.procurementItemModel.update(id,  createProcurementItemDTO);
    // }

    // async remove(id: number): Promise<any> {
    //     return this.procurementItemModel.remove(id);
    // }
}
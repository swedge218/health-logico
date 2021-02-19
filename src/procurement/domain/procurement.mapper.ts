import {Procurement} from "./procurement.entity";
import {CreateProcurementDTO} from "./dto/create-procurement.dto";

export class ProcurementMapper{
    fromDTO(dto: CreateProcurementDTO):Procurement {
        const procurement: Procurement = new Procurement();

        // procurement.dateDispatched = dto.dateDispatched;
        procurement.dateReceived = dto.dateReceived;
        procurement.remarks = dto.remarks;
        procurement.deliveryStatus = dto.deliveryStatus;
        procurement.processingOfficer = dto.processingOfficer;

        return procurement;
    }
}
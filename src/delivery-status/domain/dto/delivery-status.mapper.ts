import {DeliveryStatus} from "../delivery-status.entity";
import {CreateDeliveryStatusDTO} from "./create-delivery-status.dto";

export class DeliveryStatusMapper{
    fromDTO(dto: CreateDeliveryStatusDTO):DeliveryStatus {
        const deliveryStatus: DeliveryStatus = new DeliveryStatus();

        deliveryStatus.title = dto.title;
        deliveryStatus.description = dto.description;

        return deliveryStatus;
    }
}
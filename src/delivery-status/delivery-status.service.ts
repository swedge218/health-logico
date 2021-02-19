import { Injectable } from '@nestjs/common';
import {DeliveryStatusModel} from "./domain/delivery-status.model";
import {DeliveryStatus} from "./domain/delivery-status.entity";
import {CreateDeliveryStatusDTO} from "./domain/dto/create-delivery-status.dto";


@Injectable()
export class DeliveryStatusService {

    constructor(
        private deliveryStatusModel: DeliveryStatusModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.deliveryStatusModel.findAll(options);
    }

    async findOne(id: number): Promise<DeliveryStatus> {
        return this.deliveryStatusModel.findOne(id);
    }

    async create(createDeliveryStatusDTO: CreateDeliveryStatusDTO): Promise<DeliveryStatus> {
        return this.deliveryStatusModel.save(createDeliveryStatusDTO);
    }

    async update(id: number, createDeliveryStatusDTO: CreateDeliveryStatusDTO): Promise<DeliveryStatus> {
        return this.deliveryStatusModel.update(id,  createDeliveryStatusDTO);
    }

    async remove(id: number): Promise<any> {
        return this.deliveryStatusModel.remove(id);
    }
}
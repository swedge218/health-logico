import { Module } from '@nestjs/common';
import { PrescriptionItemController } from './prescription-item.controller';
import { PrescriptionItemService } from './prescription-item.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "../product/domain/product.entity";
import {Prescription} from "../prescription/domain/prescription.entity";
import {PrescriptionItemModel} from "./domain/prescription-item.model";
import {PrescriptionItem} from "./domain/prescription-item.entity";

@Module( {
    imports: [Product, Prescription, TypeOrmModule.forFeature([PrescriptionItem])],
    controllers: [PrescriptionItemController],
    providers: [PrescriptionItemService, PrescriptionItemModel],
    exports: [PrescriptionItemModel]
})
export class PrescriptionItemModule {}

import { Module } from '@nestjs/common';
import { PrescriptionController } from './prescription.controller';
import { PrescriptionService } from './prescription.service';
import {PrescriptionModel} from "./domain/prescription.model";
import {Patient} from "../patient/domain/patient.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Prescription} from "./domain/prescription.entity";
import {PrescriptionItemModule} from "../prescription-item/prescription-item.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Prescription]),
        Patient,
        PrescriptionItemModule
    ],
    controllers: [PrescriptionController],
    providers: [PrescriptionService, PrescriptionModel],

})
export class PrescriptionModule {}

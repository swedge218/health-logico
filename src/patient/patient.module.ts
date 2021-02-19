import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import {PatientModel} from "./domain/patient.model";
import {CancerType} from "../cancer-type/domain/cancer-type.entity";
import {Patient} from "./domain/patient.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Patient])],
    controllers: [PatientController],
    providers: [PatientService, PatientModel]
})
export class PatientModule {}

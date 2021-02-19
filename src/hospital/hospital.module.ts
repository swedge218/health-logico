import { Module } from '@nestjs/common';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Hospital} from "./domain/hospital.entity";
import {HospitalModel} from "./domain/hospital.model";
import {LocationModule} from "../location/location.module";

@Module({
    imports: [LocationModule, TypeOrmModule.forFeature([Hospital])],
    controllers: [HospitalController],
    providers: [HospitalService, HospitalModel]
})
export class HospitalModule {}

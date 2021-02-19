import { Module } from '@nestjs/common';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturerService } from './manufacturer.service';
import {ManufacturerModel} from "./domain/manufacturer.model";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Manufacturer} from "./domain/manufacturer.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Manufacturer])],
    controllers: [ManufacturerController],
    providers: [ManufacturerService, ManufacturerModel],
    exports: [ManufacturerService]
})
export class ManufacturerModule {}

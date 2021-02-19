import { Module } from '@nestjs/common';
import { CancerTypeController } from './cancer-type.controller';
import { CancerTypeService } from './cancer-type.service';
import {CancerType} from "./domain/cancer-type.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CancerTypeModel} from "./domain/cancer-type.model";

@Module({
    imports: [TypeOrmModule.forFeature([CancerType])],
    controllers: [CancerTypeController],
    providers: [CancerTypeService, CancerTypeModel],
    exports: [CancerTypeService]
})
export class CancerTypeModule {}

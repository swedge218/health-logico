import { Module } from '@nestjs/common';
import { CancerStageController } from './cancer-stage.controller';
import { CancerStageService } from './cancer-stage.service';
import {CancerType} from "../cancer-type/domain/cancer-type.entity";
import {CancerStage} from "./domain/cancer-stage.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CancerStageModel} from "./domain/cancer-stage.model";

@Module({
    imports: [TypeOrmModule.forFeature([CancerStage])],
    controllers: [CancerStageController],
    providers: [CancerStageService, CancerStageModel],
    exports: [CancerStageService]
})
export class CancerStageModule {}

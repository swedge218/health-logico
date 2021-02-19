import { Module } from '@nestjs/common';
import {ProcurementController} from "./procurement.controller";
import {ProcurementService} from "./procurement.service";
import {Procurement} from "./domain/procurement.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProcurementModel} from "./domain/procurement.model";
import {ProcurementItemModule} from "../procurement-item/procurement-item.module";
import {AdjustmentModule} from "../adjustment/adjustment.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Procurement]),
        ProcurementItemModule,
        AdjustmentModule
    ],
    controllers: [ProcurementController],
    providers: [ProcurementService, ProcurementModel],
    exports: [ProcurementService]
})
export class ProcurementModule {}

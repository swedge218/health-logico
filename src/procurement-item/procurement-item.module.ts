import { Module } from '@nestjs/common';
import {ProcurementItemController} from "./procurement-item.controller";
import {ProcurementItemService} from "./procurement-item.service";
import {ProcurementItem} from "./domain/procurement-item.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProcurementItemModel} from "./domain/procurement-item.model";
import {AdjustmentModule} from "../adjustment/adjustment.module";

@Module({
    imports: [
        AdjustmentModule,
        TypeOrmModule.forFeature([ProcurementItem])
    ],
    controllers: [ProcurementItemController],
    providers: [ProcurementItemService, ProcurementItemModel],
    exports: [ProcurementItemService, ProcurementItemModel]
})
export class ProcurementItemModule{}

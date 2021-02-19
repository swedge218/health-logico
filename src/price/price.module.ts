import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Price} from "./domain/price.entity";
import {PriceModel} from "./domain/price.model";

@Module({
    imports: [ TypeOrmModule.forFeature([Price]) ],
    controllers: [PriceController],
    providers: [PriceService, PriceModel],
    exports: [PriceModel]
})
export class PriceModule {}

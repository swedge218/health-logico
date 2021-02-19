import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import {LocationModel} from "./domain/location.model";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Location} from "./domain/location.entity";
import { LocationController } from './location.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Location])],
    providers: [LocationService, LocationModel],
    exports: [LocationService, LocationModel],
    controllers: [LocationController]
})
export class LocationModule {}

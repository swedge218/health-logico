import {Get, Injectable} from '@nestjs/common';
import {Location} from "./domain/location.entity";
import {LocationModel} from "./domain/location.model";

@Injectable()
export class LocationService {

    constructor(private readonly locationModel: LocationModel){}

    async findAll(options: any): Promise<any[]> {
        return this.locationModel.findAll(options);
    }


    findOne(id: number): Promise<Location> {
        return this.locationModel.findOne(id);
    }
}

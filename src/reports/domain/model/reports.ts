import {Connection, getConnection} from "typeorm";
import {DateFilters} from "../filters/date.filters";
import {EntityFilters} from "../filters/entity.filters";
import {Injectable} from "@nestjs/common";

@Injectable()
export class Reports {

    protected connection: Connection;
    protected dateFilters: DateFilters;
    protected productFilters: EntityFilters;

    constructor() {
        this.connection = getConnection();
        this.dateFilters = new DateFilters();
        this.productFilters = new EntityFilters();
    }

    reducer = async (promises: any[]): Promise<any> => {
        return Promise.all(promises)
            .then(results => {
                const lookup = results.reduce((arr, curr) => {
                    arr[curr.name] = curr.value;
                    return arr;
                }, {});

                return lookup;
            })
    }



}
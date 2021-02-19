import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Location} from "./location.entity";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class LocationModel extends BaseModel{

    constructor(
        @InjectRepository(Location)
        private readonly repository: Repository<Location>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<Location>> {
        return this.repository.createQueryBuilder('location');
    }

    async findAll(options: any={}): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;
        const count = await this.repository.count();
        const SQB = await this.findTemplate();

        return SQB
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return LocationModel.makePainationData(items, options, count);
            });
    }

    findOne(id: number): Promise<Location> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }
}
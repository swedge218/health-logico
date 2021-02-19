import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {Manufacturer} from "./manufacturer.entity";
import {CreateManufacturerDTO} from "./dto/create.manufacturer.dto";
import {ManufacturerMapper} from "./manufacturer.mapper";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class ManufacturerModel extends BaseModel{
    constructor(
        @InjectRepository(Manufacturer)
        private readonly repository: Repository<Manufacturer>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<Manufacturer>> {
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
                return ManufacturerModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Manufacturer> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async save(createManufacturerDTO: CreateManufacturerDTO): Promise<Manufacturer> {
        const manufacturer: Manufacturer = new ManufacturerMapper().fromDTO(createManufacturerDTO);
        return this.repository.save(manufacturer)
            .then(manufacturer => manufacturer)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createManufacturerDTO: CreateManufacturerDTO): Promise<Manufacturer> {
        const manufacturer: Manufacturer = new ManufacturerMapper().fromDTO(createManufacturerDTO);
        return this.repository.update(id,  manufacturer)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
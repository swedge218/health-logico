import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {CancerType} from "./cancer-type.entity";
import {CreateCancerTypeDTO} from "./dto/create-cancer-type.dto";
import {CancerTypeMapper} from "./cancer-type.mapper";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class CancerTypeModel extends BaseModel{
    constructor(
        @InjectRepository(CancerType)
        private readonly repository: Repository<CancerType>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<CancerType>> {
        return this.repository.createQueryBuilder('cancertype');
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
                return CancerTypeModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<CancerType> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async save(createCancerTypeDTO: CreateCancerTypeDTO): Promise<CancerType> {
        const cancerType: CancerType = new CancerTypeMapper().fromDTO(createCancerTypeDTO);
        return this.repository.save(cancerType)
            .then(cancerType => cancerType)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createCancerTypeDTO: CreateCancerTypeDTO): Promise<CancerType> {
        const cancerType: CancerType = new CancerTypeMapper().fromDTO(createCancerTypeDTO);
        return this.repository.update(id,  cancerType)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
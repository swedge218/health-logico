import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {CancerStage} from "./cancer-stage.entity";
import {CreateCancerStageDTO} from "./dto/create-cancer-stage.dto";
import {CancerStageMapper} from "./cancer-stage.mapper";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class CancerStageModel extends BaseModel{
    constructor(
        @InjectRepository(CancerStage)
        private readonly repository: Repository<CancerStage>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<CancerStage>> {
        return this.repository.createQueryBuilder('cancerstage');
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
                return CancerStageModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<CancerStage> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async save(createCancerStageDTO: CreateCancerStageDTO): Promise<CancerStage> {
        const cancerStage: CancerStage = new CancerStageMapper().fromDTO(createCancerStageDTO);
        return this.repository.save(cancerStage)
            .then(cancerStage => cancerStage)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createCancerStageDTO: CreateCancerStageDTO): Promise<CancerStage> {
        const cancerStage: CancerStage = new CancerStageMapper().fromDTO(createCancerStageDTO);
        return this.repository.update(id,  cancerStage)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
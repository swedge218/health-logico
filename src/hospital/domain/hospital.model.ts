import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {Hospital} from "./hospital.entity";
import {CreateHospitalDTO} from "./dto/create.hospital.dto";
import {HospitalMapper} from "./hospital.mapper";
import { UpdateResult, DeleteResult } from  'typeorm';
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class HospitalModel extends BaseModel{
    constructor(
        @InjectRepository(Hospital)
        private readonly repository: Repository<Hospital>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<Hospital>> {
        return this.repository
            .createQueryBuilder('hospital')
            .leftJoinAndSelect("hospital.location", "location")
            .orderBy('hospital.id', 'DESC');
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
                return HospitalModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Hospital> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async save(createHospitalDTO: CreateHospitalDTO): Promise<Hospital> {
        const hospital: Hospital = new HospitalMapper().fromDTO(createHospitalDTO);
        return this.repository.save(hospital)
            .then(hospital => hospital)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createHospitalDTO: CreateHospitalDTO): Promise<Hospital> {
        const hospital: Hospital = new HospitalMapper().fromDTO(createHospitalDTO);
        return this.repository.update(id,  hospital)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<UpdateResult> {
        return this.repository.softDelete(id);
    }
}
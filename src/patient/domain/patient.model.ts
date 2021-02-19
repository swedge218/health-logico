import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {Patient} from "./patient.entity";
import {CreatePatientDTO} from "./dto/create-patient.dto";
import {PatientMapper} from "./patient.mapper";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class PatientModel extends BaseModel{
    constructor(
        @InjectRepository(Patient)
        private readonly repository: Repository<Patient>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<Patient>> {
        return this.repository
            .createQueryBuilder('patient')
            .leftJoinAndSelect("patient.cancerStage", "cancerStage")
            .leftJoinAndSelect("patient.cancerType", "cancerType")
            .leftJoinAndSelect("patient.location", "location")
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
                return PatientModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Patient> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async save(createPatientDTO: CreatePatientDTO): Promise<Patient> {
        const patient: Patient = new PatientMapper().fromDTO(createPatientDTO);
        return this.repository.save(patient)
            .then(patient => patient)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createPatientDTO: CreatePatientDTO): Promise<Patient> {
        const patient: Patient = new PatientMapper().fromDTO(createPatientDTO);
        return this.repository.update(id,  patient)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {Permission} from "./permission.entity";
import {CreatePermissionDTO} from "./dto/create-permission.dto";
import {PermissionMapper} from "./permission.mapper";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class PermissionModel extends BaseModel{
    constructor(
        @InjectRepository(Permission)
        private readonly repository: Repository<Permission>
    ) {
        super();
    }


    async findTemplate(): Promise<SelectQueryBuilder<Permission>> {
        return this.repository.createQueryBuilder('permissions')
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
                return PermissionModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Permission> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findByName(name: string): Promise<Permission> {
        return this.findTemplate().then(sqb => {
            return sqb.where({name: name}).getOne()
        });
    }

    async save(createPermissionDTO: CreatePermissionDTO): Promise<Permission> {
        const permission: Permission = new PermissionMapper().fromDTO(createPermissionDTO);
        return this.repository.save(permission)
            .then(permission => permission)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createPermissionDTO: CreatePermissionDTO): Promise<Permission> {
        const permission: Permission = new PermissionMapper().fromDTO(createPermissionDTO);
        return this.repository.update(id,  permission)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
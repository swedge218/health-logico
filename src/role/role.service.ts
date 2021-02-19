import { Injectable } from '@nestjs/common';
import { CreateRoleDTO } from './domain/dto/create-role.dto';
import { Role } from './domain/role.entity';
import { DeleteResult } from  'typeorm';
import {RoleModel} from "./domain/role.model";

@Injectable()
export class RoleService {

    constructor (
        private roleModel: RoleModel
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.roleModel.findAll(options);
    }

    async findOne(id: number): Promise<Role> {
        return this.roleModel.findOne(id);
    }

    async findPermissions(id: number): Promise<Role> {
        return this.roleModel.findPermissions(id);
    }

    async create(createRoleDTO: CreateRoleDTO): Promise<Role> {
        return this.roleModel.save(createRoleDTO);
    }

    async update(id: number, createRoleDTO: CreateRoleDTO): Promise<Role> {
        return this.roleModel.update(id,  createRoleDTO);
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.roleModel.remove(id);
    }
}
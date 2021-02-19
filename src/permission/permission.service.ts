import { Injectable } from '@nestjs/common';
import { CreatePermissionDTO } from './domain/dto/create-permission.dto';
import { Permission } from './domain/permission.entity';
import { DeleteResult } from  'typeorm';
import {PermissionModel} from "./domain/permission.model";
import {PermissionSeederModel} from "./seeder/domain/permission-seeder.model";

@Injectable()
export class PermissionService {

    constructor (
        private permissionModel: PermissionModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.permissionModel.findAll(options);
    }

    async findOne(id: number): Promise<Permission> {
        return this.permissionModel.findOne(id);
    }

    async create(createPermissionDTO: CreatePermissionDTO): Promise<Permission> {
        return this.permissionModel.save(createPermissionDTO);
    }

    async update(id: number, createPermissionDTO: CreatePermissionDTO): Promise<Permission> {
        return this.permissionModel.update(id,  createPermissionDTO);
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.permissionModel.remove(id);
    }
}
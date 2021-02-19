import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, DeleteResult, getConnection, Repository, SelectQueryBuilder} from "typeorm";
import {Role} from "./role.entity";
import {CreateRoleDTO} from "./dto/create-role.dto";
import {RoleMapper} from "./role.mapper";
import {BaseModel} from "../../app.basemodel";
import {PermissionModel} from "../../permission/domain/permission.model";
import {Permission} from "../../permission/domain/permission.entity";

@Injectable()
export class RoleModel extends BaseModel{
    constructor(
        @InjectRepository(Role)
        private readonly repository: Repository<Role>,
        private permissionModel: PermissionModel,
        private connection: Connection = getConnection()
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<Role>> {
        return this.repository
            .createQueryBuilder('role')
            .leftJoinAndSelect("role.users", "users")
            .leftJoinAndSelect("role.acls", "permissions")
    }

    async findAll(options: any): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;
        const count = await this.repository.count();
        const templateQB = await this.findTemplate();

        return templateQB
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return RoleModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Role> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne())
    }

    async findPermissions(id: number): Promise<any> {
        return this.findTemplate().then(sqb => {
            return sqb.select('permissions.name', 'permission_names')
                .where({id: id})
                .getRawMany()
                .then(permissions => {
                    const permissionsList = {};
                    for(const permission of permissions) {
                        const alias = permission['permission_names'];
                        permissionsList[alias] = alias;
                    }
                    return permissionsList;
                })
        })
    }

    async save(createRoleDTO: CreateRoleDTO): Promise<Role> {
        const role: Role = new RoleMapper().fromDTO(createRoleDTO);
        const permissions: number[] = createRoleDTO.permissions;

        role.acls = [];

        for (const key in permissions){
            const perm: Permission = await this.permissionModel.findOne(permissions[key]);
            role.acls.push(perm)
        }

        return this.repository.save(role)
            .then(role => role)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createRoleDTO: CreateRoleDTO): Promise<Role> {
        const permissionIds: any[] = createRoleDTO.permissions;
        let role: Role = new Role();

        return this.findOne(id)
            .then((r):any => {
                role = r;
                return role;
            }).then(async(): Promise<Permission[]> => {
                return Promise.all(
                    permissionIds.map(pId => {
                        return this.permissionModel.findOne(pId);
                    })
                )
            }).then(permissions => {
                role = new RoleMapper().updateExisting(role, createRoleDTO)
                role.acls = permissions;
                return this.repository.save(role);
            }).then(() => this.findOne(id))
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
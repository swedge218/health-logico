import {forwardRef, Module} from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Role} from "../role/domain/role.entity";
import {RoleModel} from "./domain/role.model";
import {UserModule} from "../user/user.module";
import {PermissionModule} from "../permission/permission.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Role]),
        forwardRef(() => UserModule),
        forwardRef(() => PermissionModule),
    ],
    controllers: [RoleController],
    providers: [RoleService, RoleModel],
    exports: [RoleService]
})
export class RoleModule {}

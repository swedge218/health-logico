import {Logger, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission } from './domain/permission.entity';
import {PermissionModel} from "./domain/permission.model";
import {APP_GUARD} from "@nestjs/core";
import {PermissionsGuard} from "./guards/permissions.guard";
import { RoleModule } from "../role/role.module";
import {PermissionSeederModel} from "./seeder/domain/permission-seeder.model";
import {PermissionSeederService} from "./seeder/permission-seeder.service";

@Module({
    imports: [TypeOrmModule.forFeature([Permission]), RoleModule],
    controllers: [PermissionController],
    providers: [
        PermissionService,
        PermissionModel,
        PermissionSeederService,
        PermissionSeederModel,
        Logger,
        {
            provide: APP_GUARD,
            useClass: PermissionsGuard,
        }
    ],
    exports: [PermissionModel, PermissionSeederService]
})
export class PermissionModule {}
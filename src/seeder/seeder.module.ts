import {Logger, Module} from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PermissionModule} from "../permission/permission.module";
import {Permission} from "../permission/domain/permission.entity";
import {User} from "../user/domain/user.entity";
import {Location} from "../location/domain/location.entity";
import {Role} from "../role/domain/role.entity";
import {Auth} from "../auth/domain/auth.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '/var/env/.cap.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            // autoLoadEntities: true,
            entities: [
                Location,
                User,
                Auth,
                Role,
                Permission
            ],
            synchronize: true,
            logging: false
        }),
        PermissionModule
    ],
    providers: [SeederService, Logger]
})
export class SeederModule {}

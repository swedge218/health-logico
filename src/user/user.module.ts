import {forwardRef, Module} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/domain/user.entity";
import {UserModel} from "./domain/user.model";
import {AuthModule} from "../auth/auth.module";
import {RoleModule} from "../role/role.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
        forwardRef(() => RoleModule)
    ],
    controllers: [UserController],
    providers: [UserService, UserModel],
    exports: [UserService]
})
export class UserModule {}

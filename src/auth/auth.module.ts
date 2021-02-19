import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {AuthModel} from "./domain/model/auth.model";
import {AuthMapper} from "./domain/auth.mapper";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Auth} from "./domain/auth.entity";
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy} from "./strategies/jwt.strategy";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([Auth]),
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.register({
            // secret: jwtConstants.access_token_secret,
            signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
        }),
    ],
    providers: [
        AuthService,
        AuthModel,
        AuthMapper,
        LocalStrategy,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        }
    ],
    controllers: [AuthController],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}

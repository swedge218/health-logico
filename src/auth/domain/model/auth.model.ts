import {Injectable, InternalServerErrorException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from "../../../user/domain/user.entity";
import { bcrypt } from 'bcrypt';
import {AuthDTO} from "../dto/auth.dto";
import {AuthMapper} from "../auth.mapper";
import {Auth} from "../auth.entity";
import {Repository} from "typeorm";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { JwtService } from '@nestjs/jwt';
//special case of service in model layer
import {jwtConstants} from "../constants/auth.constants";


@Injectable()
export class AuthModel {
    ACCESS_TOKEN_SECRET: string = 'access_secret';
    REFRESH_TOKEN_SECRET: string = 'refresh_secret';
    TOKEN_TYPE_ACCESS = 'access';
    TOKEN_TYPE_REFRESH = 'refresh';

    constructor(
        @InjectRepository(Auth)
        private readonly repository: Repository<Auth>,
        private readonly jwtService: JwtService,
    ) {}

    async findOne(id: number): Promise<Auth> {
        return this.repository.findOne(id);
    }

    async findByUserId(userId: number): Promise<Auth> {
        return this.repository.findOne({ where: { user_id: userId}});
    }

    generateAccessToken(user: User) {
        const payload = {
            sub: user.id,
            email: user.email_address,
            roleId: user.role.id,
            type: this.TOKEN_TYPE_ACCESS
        };

        // const token = jwt.sign(
        //     payload,
        //     this.ACCESS_TOKEN_SECRET,
        //     { expiresIn: '1h', algorithm: 'HS256' });

        const token = this.jwtService.sign(
            payload, {
                secret: process.env.ACCESS_TOKEN_SECRET,
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                algorithm: 'HS256'
            });

        return  token;
    }

    generateRefreshToken(user: User) {
        const payload = {
            sub: user.id,
            email: user.email_address,
            roleId: user.role.id,
            type: this.TOKEN_TYPE_REFRESH
        };

        // const token = jwt.sign(
        //     payload,
        //     this.REFRESH_TOKEN_SECRET,
        //     { expiresIn: '1h', algorithm: 'HS256' });

        const token = this.jwtService.sign(
            payload,
            {
                secret: process.env.REFRESH_TOKEN_SECRET,
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
                algorithm: 'HS256'
            });

        return  token;
    }


    verifyRefreshToken(token: string) {
        return jwt.verify(token, this.REFRESH_TOKEN_SECRET);
    }

    async hashPassword(password: string) {
        const saltRounds = 10; //Math.floor((Math.random() * 1000) + 1);
        return await bcrypt.hash(password, saltRounds)
            .then(hash => hash)
            .catch((e) => new InternalServerErrorException(e))
    }

    async verifyPassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash)
            .then(res => res)
            .catch((e) => new InternalServerErrorException(e))
    }

    async save(authDTO: AuthDTO): Promise<any> {
        const auth = new AuthMapper().fromLogin(authDTO);
        return await this.repository.save(auth);
    }

    async update(id: number, authDTO: AuthDTO): Promise<any> {
        const auth = new AuthMapper().fromLogin(authDTO);
        return await this.repository.update(id,  auth);
    }

    async upsert(userId: number, authDTO: AuthDTO): Promise<any> {
        return this.findByUserId(userId)
            .then(async (auth) => {
                if(auth) {
                    return await this.update(auth.id, authDTO)
                } else {
                    return await this.save(authDTO)
                }
            })
    }
}
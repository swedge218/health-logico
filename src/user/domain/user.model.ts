import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {User} from "../../user/domain/user.entity";
import {CreateUserDTO} from "./dto/create.user.dto";
import {UserMapper} from "./user.mapper";
import {ResponseBuilder} from "../../utils/ResponseBuilder";
import {BaseModel} from "../../app.basemodel";
import {UserStatusDTO} from "./dto/user.status.dto";
import {UpdateUserDTO} from "./dto/update.user.dto";


@Injectable()
export class UserModel extends BaseModel{
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<User>>{
        return this.repository
            .createQueryBuilder('user')
            .leftJoinAndSelect("user.role", "role")
            .leftJoinAndSelect("user.location", "location")
            .where({active: 1});
    }

    async findAll(options: any): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;
        const count = await this.repository.count({active: 1});
        const SQB = await this.findTemplate();

        return SQB
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return UserModel.makePainationData(items, options, count);
            });
    }


    async findAllDisabled(options: any): Promise<any> {
        const page: number = Number(options.page);
        const limit: number = Number(options.limit);
        const offset = (page - 1) * limit;
        const count = await this.repository.count({active: 0});
        const SQB = await this.findTemplate();

        return SQB
            .where({active: 0})
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return UserModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<User> {
        const SQB = await this.findTemplate();
        return SQB
            .andWhere("user.id = :id", {id: id})
            .getOne();
    }

    async findByEmail(email: string): Promise<User> {
        const SQB = await this.findTemplate();
        return SQB
            .andWhere("email_address = :email_address", { email_address: email})
            .getOne();
    }

    async findFullInfoByEmail(email: string): Promise<User> {
        const SQB = await this.findTemplate();
        return SQB
            .addSelect('user.password')
            .andWhere("email_address = :email_address", { email_address: email})
            .getOne();
    }

    async validateAuth(email: string, password: string): Promise<User> {
        return this.repository.findOne({ where: {
                email_address: email, password: password
            }});
    }

    async save(createUserDTO: CreateUserDTO): Promise<User> {
        const user: User = new UserMapper().fromDTO(createUserDTO);
        return this.repository.save(user)
            .then(user => {
                delete user.password;
                return user;
            })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }


    async update(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {
        const user: User = new UserMapper().fromDTO(updateUserDTO);
        if(user.hasOwnProperty('password')) delete user.password;
        return this.repository.update(id,  user)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }


    async changePassword(id: number, passwordHash: string): Promise<string> {
        return this.repository
            .createQueryBuilder( 'user')
            .addSelect('user.password')
            .where('user.id = :id', { id: id})
            .getOne()
            .then(user => {
                user.password = passwordHash;
                return user

            }).then( user => {

                return this.repository.update(id,  user)
                    .then(() => {
                        const msg = `Password successfully changed for ` +
                            `User: ${user.id}, email: ${user.email_address}`;
                        const response = ResponseBuilder.makeOKResponse(msg);
                        return JSON.parse(JSON.stringify(response));
                    }).catch((e) => {
                        throw new InternalServerErrorException(e)
                    })
            })
    }


    async block(id: number, userStatusDTO: UserStatusDTO): Promise<User> {
        try {
            const status = userStatusDTO.blocked;

            return this.repository
                .createQueryBuilder('user')
                .where('user.id = :id', {id: id})
                .getOne()
                .then(user => {
                    user.active = status == true ? 0 : 1;
                    return this.repository.update(id, user)
                        .then(() => {
                            const statusText = status == true ? "BLOCKED" : "UNBLOCKED";
                            const msg = `${user.first_name} ${user.last_name} (ID: ${user.id}) `+ `successfully ${statusText}`;
                            const response = ResponseBuilder.makeOKResponse(msg);
                            return JSON.parse(JSON.stringify(response));
                        })
                })
        } catch(e) {
            throw new InternalServerErrorException(e)
        }
    }

}
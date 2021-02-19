import {forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDTO} from "../user/domain/dto/create.user.dto";
import {UserModel} from "../user/domain/user.model";
import {User} from "./domain/user.entity";
import {AuthService} from "../auth/auth.service";
import {UserStatusDTO} from "./domain/dto/user.status.dto";
import {UpdateUserDTO} from "./domain/dto/update.user.dto";


@Injectable()
export class UserService {

    ////////////////////////////////////////////////////////////////
    constructor(
        private userModel: UserModel,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}


    async findAll(options: any): Promise<any[]> {
        return this.userModel.findAll(options);
    }

    async findAllDisabled(options: any): Promise<any[]> {
        return this.userModel.findAllDisabled(options);
    }

    async findOne(id: number): Promise<User> {
        return this.userModel.findOne(id);
    }

    async create(createUserDTO: CreateUserDTO): Promise<User> {
        const passwordObj = { password: createUserDTO.password };
        await this.authService.hashPassword(passwordObj)
            .then(passwordHash => {
                createUserDTO.password = passwordHash;
            })

        return this.userModel.save(createUserDTO);
    }

    async update(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {
        return this.userModel.update(id,  updateUserDTO);
    }

    async changePassword(id: number, passwordObj: any): Promise<string> {
        const hash = await this.authService.hashPassword(passwordObj);
        return this.userModel.changePassword(id, hash);
    }

    async block(id: number, userStatusDTO: UserStatusDTO): Promise<any> {
        return this.userModel.block(id, userStatusDTO);
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findByEmail(email);
    }

    async findFullInfoByEmail(email: string): Promise<User> {
        return this.userModel.findFullInfoByEmail(email);
    }

    async validateAuth(email: string, password: string): Promise<User> {
        return this.userModel.validateAuth(email, password);
    }
}
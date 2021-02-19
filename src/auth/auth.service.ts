import {Injectable, HttpException, HttpStatus,
    forwardRef, Inject, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {AuthModel} from "./domain/model/auth.model";
import {AuthMapper} from "./domain/auth.mapper";
import {Auth} from "./domain/auth.entity";
import {AuthDTO} from "./domain/dto/auth.dto";


@Injectable()
export class AuthService {

    ///////////////////////////////////////////////////
    constructor(
        private readonly authModel: AuthModel,
        private readonly authMapper: AuthMapper,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ){}

    async findOne(id: number): Promise<Auth> {
        return this.authModel.findOne(id);
    }

    async validateUser(postUser) {
        const {email, password } = postUser;

        return this.userService.findFullInfoByEmail(email)
            .then( async (user) =>  {
                //console.log('full user', user)
                if(user) {
                    return this.authModel.verifyPassword(password, user.password)
                        .then(async (hashedResult) => {
                            if (hashedResult) {
                                delete user.password;
                                return user;

                            } else {
                                throw new UnauthorizedException();
                            }
                        })
                } else {
                    throw new UnauthorizedException();
                }
            })
    }

    async login(user: any): Promise<any> {


        const access = this.authModel.generateAccessToken(user);
        const refresh = this.authModel.generateRefreshToken(user);
        const authDTO = new AuthDTO().createDTO(user.id, refresh,  1);

        return this.authModel.upsert(user.id, authDTO)
            .then( auth => {
                return this.authMapper.toAuthResponse(user,  access, refresh);
            })
    }

    async authenticate(postUser) {
        const {email, password } = postUser;

        return this.userService.findFullInfoByEmail(email)
            .then( async (user) =>  {
                //console.log('full user', user)
                if(user) {
                    return this.authModel.verifyPassword(password, user.password)
                        .then(async (hashedResult) => {
                            if (hashedResult) {

                                const access = this.authModel.generateAccessToken(user);
                                const refresh = this.authModel.generateRefreshToken(user);
                                const authDTO = new AuthDTO().createDTO(user.id, refresh,  1);

                                return this.authModel.upsert(user.id, authDTO)
                                    .then( auth => {
                                        return this.authMapper.toAuthResponse(user,  access, refresh);
                                    })


                            } else {
                                throw new UnauthorizedException();
                            }
                        })
                } else {
                    throw new UnauthorizedException();
                }
            })
    }

    refreshAccess(refreshDetails) {
        const {email, token } = refreshDetails;
        return this.userService.findByEmail(email)
            .then( async (user) => {
                if (user) {
                    const userId = user.id;
                    return await this.authModel.findByUserId(userId)
                        .then( (auth) => {
                            if (auth.user_id === userId && auth.refresh_token === token){
                                const refreshResult = this.authModel.verifyRefreshToken(token);

                                const access = this.authModel.generateAccessToken(user);
                                const refresh = this.authModel.generateRefreshToken(user);
                                const authDTO = new AuthDTO().createDTO(
                                    user.id, refresh,  1);
                                return this.authModel.update(auth.id, authDTO)
                                    .then(() =>{
                                        return this.authMapper.toAuthResponse(
                                            user, access, refresh);
                                    })
                            } else {
                                throw new UnauthorizedException();
                            }
                        }).catch(err => {
                            throw new UnauthorizedException();
                        })
                }
            })
    }

    async hashPassword(passwordObj): Promise<string> {
        const {password} = passwordObj;
        return await this.authModel.hashPassword(password).then(hash =>  hash );
    }
}

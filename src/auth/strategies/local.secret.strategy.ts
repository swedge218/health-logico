import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'id',  passwordField: 'secret'});
    }

    //returns as a user object in http request object
    async validate(email: string, password: string): Promise<any> {
        const userObj = {email, password};
        const user = await this.authService.validateUser(userObj);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
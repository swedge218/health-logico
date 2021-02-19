import {AuthDTO} from "./dto/auth.dto";
import {Auth} from "./auth.entity";
import {User} from "../../user/domain/user.entity";
import {jwtConstants} from "./constants/auth.constants";

export class AuthMapper {

    toAuthResponse(user: User, accessToken: string, refreshToken: string) {
        return {
            user: {
                email_address: user.email_address,
                location: user.location,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            },
            tokens: {
                access: accessToken,
                refresh: refreshToken,
                expiresIn: jwtConstants.access_token_expiry
            }
        }
    }

    toRefreshResponse(accessToken: string, refreshToken: string) {
        return {
            access: accessToken,
            refresh: refreshToken
        }
    }


    fromLogin(authDTO: AuthDTO):Auth {
        const auth = new Auth();
        auth.user_id = authDTO.user_id;
        auth.refresh_token = authDTO.refresh_token;
        auth.token_valid = authDTO.token_valid;
        return auth;
    }
}
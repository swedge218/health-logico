import {Body, Controller, Get, Param, Post, Request, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Auth} from "./domain/auth.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {Public} from "./decorators/public.decorator";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "./decorators/closed.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Get()
    getAll() {
        return 'This is from the get All function';
    }

    @RequiredPermissions(PermissionsEnum.VIEW_AUTH)
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Auth> {
        return this.authService.findOne(id)
            .then(auth => {
                return ResponseBuilder.makeFindResponder(auth);
            });
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req, @Body() user): Promise<any> {
        // return this.authService.authenticate(user);
        //user is returned/created into request object by passport
        const passportUser = req.user;
        return this.authService.login(passportUser);
    }

    // // @UseGuards(LocalAuthGuard)
    // @Post('/plogin')
    // async passportLogin(@Request() req) {
    //     const user = req.user; //user is returned/created into request object by passport
    //     return this.authService.login(user);
    // }

    @Public()
    @Post('/refresh')
    refresh(@Body() refreshDetails): Promise<any> {
        return this.authService.refreshAccess(refreshDetails)
    }

    @Closed()
    @Post('/prefresh')
    passportRefresh(@Body() refreshDetails): Promise<any> {
        return this.authService.refreshAccess(refreshDetails)
    }

    @Closed()
    @Post('/password')
    hashPassword(@Body() password): Promise<any> {
        return this.authService.hashPassword(password);
    }
}

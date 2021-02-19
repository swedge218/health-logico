import {ExecutionContext, Injectable, Logger} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {Reflector} from "@nestjs/core";
import { IS_PUBLIC_KEY} from "../decorators/public.decorator";
import {IS_CLOSED_KEY} from "../decorators/closed.decorator";
import {IS_SECRET_AUTH} from "../decorators/secret.auth.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private logger: Logger = new Logger(JwtAuthGuard.name);

    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isClosed = this.checkForClosedContext(context);
        if(isClosed) { return false; }

        const isPublic = this.checkForPublicContext(context);
        if (isPublic) { return true; }

        const isSecretAuth = this.checkForSecretAuthContext(context);
        if (isSecretAuth) { return true; }

        return super.canActivate(context);
    }

    checkForPublicContext(context: ExecutionContext) {
        return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    }

    checkForClosedContext(context: ExecutionContext) {
        return this.reflector.getAllAndOverride<boolean>(IS_CLOSED_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    }

    checkForSecretAuthContext(context: ExecutionContext) {
        return this.reflector.getAllAndOverride<boolean>(IS_SECRET_AUTH, [
            context.getHandler(),
            context.getClass(),
        ]);
    }
}
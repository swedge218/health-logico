import {Injectable, CanActivate, ExecutionContext, Logger} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {PermissionsEnum} from "../domain/enums/permissions.enum";
import {PERMISSIONS_KEY} from "../decorators/permissions.decorator";
import { RoleService } from "../../role/role.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private roleService: RoleService,
        private readonly logger: Logger)
    {
        this.logger.setContext(PermissionsGuard.name)
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<PermissionsEnum[]>(
            PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        this.logger.log("The required permission is " + requiredPermissions)

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authUser = request.user;
        //console.log('authUser', authUser);

        return this.roleService.findPermissions(authUser.roleId)
            .then(permissions => {
                const permissionValues = Object.values(permissions);
                this.logger.log("User's permissions => " + permissionValues.join(','));

                return requiredPermissions.some((acl) => {
                    this.logger.log('acl ' + acl);
                    return permissionValues.includes(acl);
                });
            })
    }
}
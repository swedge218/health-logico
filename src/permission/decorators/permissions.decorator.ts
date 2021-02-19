import { SetMetadata } from '@nestjs/common';
import {PermissionsEnum} from "../domain/enums/permissions.enum";

export const PERMISSIONS_KEY = 'permissions';
export const RequiredPermissions = (...permissions: PermissionsEnum[]) => {
    return SetMetadata(PERMISSIONS_KEY, permissions);
}
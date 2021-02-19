import {Injectable, Logger} from '@nestjs/common';
import {PermissionSeederModel} from "./domain/permission-seeder.model";

@Injectable()
export class PermissionSeederService {
    private readonly logger = new Logger('PermissionSeederService');

    constructor (
        private permissionSeederModel: PermissionSeederModel,
    ) {}

    async seedPermissions(): Promise<void> {
        await this.permissionSeederModel.run();
    }
}
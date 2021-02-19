import { Injectable } from '@nestjs/common';
import {Logger} from "@nestjs/common";
import {PermissionSeederService} from "../permission/seeder/permission-seeder.service";

@Injectable()
export class SeederService {
    private readonly logger = new Logger('SeederService');

    constructor(
        private readonly permissionSeederService: PermissionSeederService
    ) {}

    async seed() {
        this.logger.log("--------------Seeding begins--------------", "SeederService");

        // seed permissions
        await this.permissionSeederService.seedPermissions()
            .then(() => this.logger.debug("Permission Ends Successfully"))
            .catch(e => this.logger.error("Permission failed"));

        this.logger.log("--------------Seeding Done--------------", "SeederService");
    }
}

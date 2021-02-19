import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {CreatePermissionDTO} from "../../domain/dto/create-permission.dto";
import {PermissionMapper} from "../../domain/permission.mapper";
import {BaseModel} from "../../../app.basemodel";
import {PermissionModel} from "../../domain/permission.model";
import {permissionSeeds} from "./data";
import {Logger} from "@nestjs/common";

@Injectable()
export class PermissionSeederModel extends BaseModel{
    private readonly logger = new Logger('PermissionSeeder');

    constructor(
        private readonly permissionModel: PermissionModel
    ) {
        super();
    }


    async run(): Promise<void> {
        this.logger.log("Starting permission seeding")
        //await permissionSeeds.forEach(async (permissionSeed) => {

        for(const permissionSeed of permissionSeeds) {
            // this.logger.log("Current Seed: " + JSON.stringify(permissionSeed))
            await this.permissionModel.findByName(permissionSeed.name)
                .then(async (permission) =>{
                    if(permission) {
                        this.logger.log(`${permissionSeed.name} found in DB`);
                        return;
                    } // return here = continue

                    this.logger.log("Seeding " + permissionSeed.name);
                    const dto: CreatePermissionDTO = new PermissionMapper().toDTO(
                        permissionSeed.name,
                        permissionSeed.description,
                        permissionSeed.category,
                        permissionSeed.sortOrder
                    );

                    return await this.permissionModel.save(dto)
                }).catch(e => {
                    this.logger.error(`${permissionSeed.name}
                        seeding failed ${e.message}`);
                    //throw new InternalServerErrorException(e);
                });

        };

        // this.logger.log("Permission Seeding completed successfully");
    }

}
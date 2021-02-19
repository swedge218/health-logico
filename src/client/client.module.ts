import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Client} from "./domain/client.entity";
import {ClientModel} from "./domain/client.model";
import {LocationModule} from "../location/location.module";
import {IsSecretExistsConstraint} from "../validators/secret.exists.validator";

@Module({
    imports: [LocationModule, TypeOrmModule.forFeature([Client])],
    controllers: [ClientController],
    providers: [ClientService, ClientModel, IsSecretExistsConstraint]
})
export class ClientModule {}

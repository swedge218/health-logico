import { Injectable } from '@nestjs/common';
import {Client} from "./domain/client.entity";
import {CreateClientDTO} from "./domain/dto/create.client.dto";
import {ClientModel} from "../client/domain/client.model";
import {BlockClientDTO} from "./domain/dto/block.client.dto";

@Injectable()
export class ClientService {
    constructor(
        private clientModel: ClientModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.clientModel.findAll(options);
    }

    async findOne(id: number): Promise<Client> {
        return this.clientModel.findOne(id);
    }

    async create(createClientDTO: CreateClientDTO): Promise<Client> {
        return this.clientModel.save(createClientDTO);
    }

    async update(id: number, createClientDTO: CreateClientDTO): Promise<Client> {
        return this.clientModel.update(id,  createClientDTO);
    }

    async generateKey(): Promise<string> {
        return this.clientModel.generateKey();
    }

    async resetKey(id: number): Promise<string> {
        return this.clientModel.resetKey(id);
    }

    async changeStatus(id: number, blockClientDTO: BlockClientDTO): Promise<any> {
        return this.clientModel.changeStatus(id, blockClientDTO);
    }
}

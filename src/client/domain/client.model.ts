import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {Client} from "./client.entity";
import {CreateClientDTO} from "./dto/create.client.dto";
import {ClientMapper} from "./client.mapper";
import {BaseModel} from "../../app.basemodel";
import {ClientStatusEnums, ClientStatusResponseEnums} from "./enums/client.enums";
import {BlockClientDTO} from "./dto/block.client.dto";

const crypto = require('crypto')

@Injectable()
export class ClientModel extends BaseModel{
    constructor(
        @InjectRepository(Client)
        private readonly repository: Repository<Client>,
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<Client>> {
        return this.repository.createQueryBuilder('client')
    }

    async findAll(options: any={}): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;
        const count = await this.repository.count();
        const SQB = await this.findTemplate();

        return SQB
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return ClientModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Client> {
        return this.findTemplate().then(sqb => {
            return sqb
                .where({id: id})
                .getOne()
                .then(client => {
                    if(!client) throw new NotFoundException("Client Not Found");
                    return client;
                })
        });
    }

    async findKey(id: number): Promise<string> {
        return this.findTemplate().then(sqb => {
            return sqb
                .addSelect("secret")
                .where({id: id})
                .getOne()
                .then(client => {
                    if(!client) throw new NotFoundException("Client Not Found");
                    return client.secret;
                })
        });
    }

    async findBySecret(secret: string): Promise<Client> {
        return this.findTemplate().then(sqb => {
            return sqb
                .where({secret})
                .getOne()
                .then(client => {
                    if(!client) throw new NotFoundException("Client Not Found");
                    return client;
                })
        });
    }

    async save(createClientDTO: CreateClientDTO): Promise<Client> {
        const client: Client = new ClientMapper().fromDTO(createClientDTO);
        client.secret = await this.generateKey();

        return this.repository.save(client)
            .then(client => client)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createClientDTO: CreateClientDTO): Promise<Client> {
        const client: Client = new ClientMapper().fromDTO(createClientDTO);
        return this.repository.update(id,  client)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async generateKey(): Promise<any> {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(20, function(err, buffer) {
                if(err) throw new InternalServerErrorException("Error generating secret key.");
                const hexEncoded = buffer.toString('hex');
                // console.log('hexEncoded', hexEncoded);
                return resolve(hexEncoded)
            });
        })
    }

    async resetKey(id: number): Promise<string> {
        const secret = await this.generateKey();
        return this.repository.update(id, {secret})
            .then(() => "Client key reset successful")
            .catch((e) => {
                throw new InternalServerErrorException(e)
            });
    }


    async changeStatus(id: number, blockClientDTO: BlockClientDTO): Promise<string> {
        const responseText = blockClientDTO.active === true ?
            ClientStatusResponseEnums.UNBLOCKED : ClientStatusResponseEnums.BLOCKED;

        const status = blockClientDTO.active === true ?
            ClientStatusEnums.ACTIVE : ClientStatusEnums.BLOCKED;

        return this.repository.update(id, { active: status })
            .then(() => responseText)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            });
    }
}
import {ClientModel} from "../client.model";
import {Logger} from "@nestjs/common";
import {Test, TestingModule} from '@nestjs/testing';
import {Client} from "../client.entity";
import { getRepositoryToken } from '@nestjs/typeorm';
import {ClientRepositoryFake} from "./client.repository.fake";

describe('ClientModel', () => {
    let clientModel: ClientModel;
    const logger = new Logger('ClientModel');
    const crypto = require('crypto')
    const faker = require('faker');

    jest.mock('crypto');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClientModel,
                {
                    provide: getRepositoryToken(Client),
                    useClass: ClientRepositoryFake,
                },
                {
                    provide: getRepositoryToken(Client),
                    useClass: ClientRepositoryFake,
                }
            ],
        }).compile();

        clientModel = module.get(ClientModel);
        // playlistRepository = module.get(getRepositoryToken(Playlist));
    });

    it('generates secret key', async () => {

        const finalKey = faker.lorem.word();

        const generateKeySpy = jest.spyOn(
            clientModel, 'generateKey').mockResolvedValue(finalKey);

        const key = await clientModel.generateKey();

        expect(key).toEqual(finalKey);

    })
})
import {Client} from "./client.entity";
import {CreateClientDTO} from "./dto/create.client.dto";

export class ClientMapper {
    fromDTO(dto: CreateClientDTO):Client {
        const client: Client = new Client();

        client.name = dto.name;
        client.email = dto.email;
        return client;
    }
}
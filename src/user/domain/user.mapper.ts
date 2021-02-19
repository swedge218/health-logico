import { User } from "./user.entity";
import {CreateUserDTO} from "./dto/create.user.dto";

export class UserMapper {
    fromDTO = (dto: CreateUserDTO): User => {
        const user: User = new User();

        user.email_address = dto.email_address;
        user.password = dto.password;
        user.supervisor = dto.supervisor;
        user.location = dto.location;
        user.first_name = dto.first_name;
        user.last_name = dto.last_name;
        user.phone_number = dto.phone_number;
        user.role = dto.role;

        return user;
    }
}
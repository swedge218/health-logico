import { Role } from "./role.entity";
import { CreateRoleDTO } from "./dto/create-role.dto";

export class RoleMapper {
    fromDTO(dto: CreateRoleDTO): Role {
        const role: Role = new Role();

        role.name = dto.name;
        role.description = dto.description;
        role.level = dto.level;

        return role;
    }

    updateExisting(role: Role, dto: CreateRoleDTO): Role {

        role.name = dto.name;
        role.description = dto.description;
        role.level = dto.level;

        return role;
    }
}
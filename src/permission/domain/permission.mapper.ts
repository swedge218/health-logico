import { Permission } from './permission.entity';
import {CreatePermissionDTO} from "./dto/create-permission.dto";
import {PermissionCategoriesEnum} from "../seeder/domain/permission-categories.enum";

export class PermissionMapper {
    fromDTO(createPermissionDTO: CreatePermissionDTO): Permission {
        const permission: Permission = new Permission();

        permission.name = createPermissionDTO.name;
        permission.description = createPermissionDTO.description;
        permission.category = createPermissionDTO.category;
        permission.sortOrder = createPermissionDTO.sortOrder;

        return permission;
    }

    toDTO(name: string, desc: string, category: PermissionCategoriesEnum,
          order: number): CreatePermissionDTO {
        const dto: CreatePermissionDTO = new CreatePermissionDTO();

        dto.name = name;
        dto.description = desc;
        dto.category = category;
        dto.sortOrder = order;

        return dto;
    }
}
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {PermissionCategoriesEnum} from "../../seeder/domain/permission-categories.enum";

export class CreatePermissionDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    category: PermissionCategoriesEnum;

    @IsNotEmpty()
    @IsNumber()
    sortOrder: number;
}
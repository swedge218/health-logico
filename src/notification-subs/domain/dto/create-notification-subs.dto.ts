import {IsNotEmpty, IsNumber} from "class-validator";
import {Role} from "../../../role/domain/role.entity";
import {NotificationType} from "../../../notification-type/domain/notification-type.entity";

export class CreateNotificationSubsDTO {
    @IsNotEmpty()
    @IsNumber()
    role: Role;

    @IsNotEmpty()
    @IsNumber()
    notificationType: NotificationType;
}
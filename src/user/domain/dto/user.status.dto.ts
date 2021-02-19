import {IsBoolean, IsNotEmpty} from "class-validator";

export class UserStatusDTO {
    @IsNotEmpty()
    @IsBoolean()
    blocked: boolean;
}
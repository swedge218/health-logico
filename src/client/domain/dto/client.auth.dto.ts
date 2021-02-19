import {IsNotEmpty, MinLength, IsString, IsInt, IsNumber, IsEmail, IsBoolean} from 'class-validator';

import {Expose} from "class-transformer";
import {IsSecretExists} from "../../../validators/secret.exists.validator";

export class ClientAuthDTO {

    @IsNotEmpty()
    @IsString()
    @Expose({ name: "secret-key"})  //name used in header. lower case only
    @IsSecretExists()
    secretKey: string;
}
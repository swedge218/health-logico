import {IsString} from "class-validator";

export class CreateManufacturerDTO {
    @IsString()
    title: string;
}
import {IsNotEmpty, IsNumber} from 'class-validator';

export class UpdateNotificationDTO {

    @IsNotEmpty()
    @IsNumber()
    viewed: number;
}
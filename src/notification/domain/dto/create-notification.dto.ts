import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {Notification} from "../notification.entity";

export class CreateNotificationDTO {

    @IsNotEmpty()
    @IsString()
    actionUrl: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    viewed: number;

    @IsString()
    notifcationType: string;

    @IsNotEmpty()
    @IsNumber()
    remoteId: number;
}
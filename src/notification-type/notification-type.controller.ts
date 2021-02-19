import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {NotificationTypeService} from "./notification-type.service";
import {CreateNotificationTypeDTO} from "./domain/dto/create-notification-type.dto";
import {NotificationType} from "./domain/notification-type.entity";

@Controller('notification-type')
export class NotificationTypeController {
    constructor(private readonly notificationTypeService: NotificationTypeService){}

    @Get()
    async findAll(): Promise<NotificationType[]> {
        return this.notificationTypeService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<NotificationType> {
        return this.notificationTypeService.findOne(id);
    }

    @Post()
    async create(@Body() createNotificationTypeDTO: CreateNotificationTypeDTO) {
        return this.notificationTypeService.create(createNotificationTypeDTO);
    }

    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createNotificationTypeDTO: CreateNotificationTypeDTO): Promise<NotificationType> {
        return this.notificationTypeService.update(id,  createNotificationTypeDTO);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.notificationTypeService.remove(id);
    }
}

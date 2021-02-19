import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {NotificationService} from "../notification/notification.service";
import {Notification} from "../notification/domain/notification.entity";
import {CreateNotificationDTO} from "./domain/dto/create-notification.dto";
import {UpdateNotificationDTO} from "./domain/dto/update-notification.dto";

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService){}

    @Get()
    async findAll(): Promise<Notification[]> {
        return this.notificationService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
        return this.notificationService.findOne(id);
    }

    @Post()
    async create(@Body() createNotificationDTO: CreateNotificationDTO) {
        return this.notificationService.create(createNotificationDTO);
    }

    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() updateNotificationDTO: UpdateNotificationDTO): Promise<Notification> {
        return this.notificationService.update(id,  updateNotificationDTO);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.notificationService.remove(id);
    }
}

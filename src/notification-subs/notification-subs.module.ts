import { Module } from '@nestjs/common';
import { NotificationSubsController } from './notification-subs.controller';
import { NotificationSubsService } from './notification-subs.service';

@Module({
  controllers: [NotificationSubsController],
  providers: [NotificationSubsService]
})
export class NotificationSubsModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationSubsController } from './notification-subs.controller';

describe('NotificationSubsController', () => {
  let controller: NotificationSubsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationSubsController],
    }).compile();

    controller = module.get<NotificationSubsController>(NotificationSubsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NotificationSubsService } from './notification-subs.service';

describe('NotificationSubsService', () => {
  let service: NotificationSubsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationSubsService],
    }).compile();

    service = module.get<NotificationSubsService>(NotificationSubsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

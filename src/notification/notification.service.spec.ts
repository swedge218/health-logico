import { Test, TestingModule } from '@nestjs/testing';
import { OrderNotificationsService } from './notification.service';

describe('OrderNotificationsService', () => {
  let service: OrderNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderNotificationsService],
    }).compile();

    service = module.get<OrderNotificationsService>(OrderNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { StockReceiptItemService } from './stock-receipt-item.service';

describe('StockReceiptItemService', () => {
  let service: StockReceiptItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockReceiptItemService],
    }).compile();

    service = module.get<StockReceiptItemService>(StockReceiptItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

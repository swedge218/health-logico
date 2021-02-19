import { Test, TestingModule } from '@nestjs/testing';
import { StockReceiptService } from './stock-receipt.service';

describe('StockReceiptService', () => {
  let service: StockReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockReceiptService],
    }).compile();

    service = module.get<StockReceiptService>(StockReceiptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

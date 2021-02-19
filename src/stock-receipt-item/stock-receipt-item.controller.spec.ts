import { Test, TestingModule } from '@nestjs/testing';
import { StockReceiptItemController } from './stock-receipt-item.controller';

describe('StockReceiptItemController', () => {
  let controller: StockReceiptItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockReceiptItemController],
    }).compile();

    controller = module.get<StockReceiptItemController>(StockReceiptItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

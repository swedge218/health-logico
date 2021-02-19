import { Test, TestingModule } from '@nestjs/testing';
import { StockReceiptController } from './stock-receipt.controller';

describe('StockReceiptController', () => {
  let controller: StockReceiptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockReceiptController],
    }).compile();

    controller = module.get<StockReceiptController>(StockReceiptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

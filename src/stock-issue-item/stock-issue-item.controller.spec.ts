import { Test, TestingModule } from '@nestjs/testing';
import { StockIssueItemController } from './stock-issue-item.controller';

describe('StockIssueItemController', () => {
  let controller: StockIssueItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockIssueItemController],
    }).compile();

    controller = module.get<StockIssueItemController>(StockIssueItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { StockIssueController } from './stock-issue.controller';

describe('StockIssueController', () => {
  let controller: StockIssueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockIssueController],
    }).compile();

    controller = module.get<StockIssueController>(StockIssueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

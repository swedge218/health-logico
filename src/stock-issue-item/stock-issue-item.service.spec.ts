import { Test, TestingModule } from '@nestjs/testing';
import { StockIssueItemService } from './stock-issue-item.service';

describe('StockIssueItemService', () => {
  let service: StockIssueItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockIssueItemService],
    }).compile();

    service = module.get<StockIssueItemService>(StockIssueItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

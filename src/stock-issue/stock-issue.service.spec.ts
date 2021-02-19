import { Test, TestingModule } from '@nestjs/testing';
import { StockIssueService } from './stock-issue.service';

describe('StockIssueService', () => {
  let service: StockIssueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockIssueService],
    }).compile();

    service = module.get<StockIssueService>(StockIssueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

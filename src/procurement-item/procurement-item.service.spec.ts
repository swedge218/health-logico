import { Test, TestingModule } from '@nestjs/testing';
import { ProcurementItemService } from './procurement-item.service';

describe('ProcurementItemService', () => {
  let service: ProcurementItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcurementItemService],
    }).compile();

    service = module.get<ProcurementItemService>(ProcurementItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

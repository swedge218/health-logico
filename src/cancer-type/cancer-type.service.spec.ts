import { Test, TestingModule } from '@nestjs/testing';
import { CancerTypeService } from './cancer-type.service';

describe('CancerTypeService', () => {
  let service: CancerTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancerTypeService],
    }).compile();

    service = module.get<CancerTypeService>(CancerTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

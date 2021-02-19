import { Test, TestingModule } from '@nestjs/testing';
import { CancerStageService } from './cancer-stage.service';

describe('CancerStageService', () => {
  let service: CancerStageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancerStageService],
    }).compile();

    service = module.get<CancerStageService>(CancerStageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

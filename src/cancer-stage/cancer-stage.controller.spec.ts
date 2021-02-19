import { Test, TestingModule } from '@nestjs/testing';
import { CancerStageController } from './cancer-stage.controller';

describe('CancerStageController', () => {
  let controller: CancerStageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancerStageController],
    }).compile();

    controller = module.get<CancerStageController>(CancerStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

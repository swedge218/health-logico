import { Test, TestingModule } from '@nestjs/testing';
import { CancerTypeController } from './cancer-type.controller';

describe('CancerTypeController', () => {
  let controller: CancerTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancerTypeController],
    }).compile();

    controller = module.get<CancerTypeController>(CancerTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

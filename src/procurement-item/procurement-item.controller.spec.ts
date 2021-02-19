import { Test, TestingModule } from '@nestjs/testing';
import { ProcurementItemController } from './procurement-item.controller';

describe('ProcurementItemController', () => {
  let controller: ProcurementItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcurementItemController],
    }).compile();

    controller = module.get<ProcurementItemController>(ProcurementItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

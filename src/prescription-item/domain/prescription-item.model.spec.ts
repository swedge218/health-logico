import { Test, TestingModule } from '@nestjs/testing';
import {PrescriptionItemModel} from "./prescription-item.model";

describe('PrescriptionItemModel', () => {
    let model: PrescriptionItemModel;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrescriptionItemModel],
        }).compile();

        model = module.get<PrescriptionItemModel>(PrescriptionItemModel);
    });

    it('should be defined', () => {
        expect(model).toBeDefined();
    });
});

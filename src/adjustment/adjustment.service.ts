import { Injectable } from '@nestjs/common';
import {AdjustmentModel} from "./domain/adjustment.model";
import {Adjustment} from "./domain/adjustment.entity";
import {StockService} from "../stock/stock.service";
import {Product} from "../product/domain/product.entity";
import {Hospital} from "../hospital/domain/hospital.entity";
import {AdjustmentActionEnums} from "./domain/enums/adjustment.type.enums";
import {CreateAdjustmentDTO} from "./domain/dto/create-adjustment.dto";

@Injectable()
export class AdjustmentService {

    constructor(
        private adjustmentModel: AdjustmentModel,
        private stockService: StockService
    ) {}

    async findAll(options: any): Promise<any> {
        return this.adjustmentModel.findAll(options);
    }

    async findOne(id: number): Promise<Adjustment> {
        return this.adjustmentModel.findOne(id);
    }

    async create(createAdjustmentDTO: CreateAdjustmentDTO, initMode: boolean): Promise<Adjustment> {
        return this.adjustmentModel.save(createAdjustmentDTO);
    }

    async registerProduct(product: Product): Promise<Adjustment> {
        return this.adjustmentModel.registerProduct(product);
    }

    async upAdjustment(product: Product, quantity: number, batchNumber: string,
                       adjustmentAction: AdjustmentActionEnums,
                       remarks: string, hospital: Hospital=null): Promise<Adjustment> {

        // const setupAdjustmentDTO: SetupAdjustmentDTO = new SetupAdjustmentDTO();
        // const createAdjustmentDTO: CreateAdjustmentDTO = setupAdjustmentDTO.setUpDTO(
        //     product, quantity, STOCK_ADJUST_UP, remarks, hospital);
        //
        // const hospitalId = hospital instanceof Hospital ? hospital.id : null;
        //
        // return this.stockService.facilityHasProductRegistered(product.id, hospitalId)
        //     .then(hasProduct => {
        //         console.log('hasProduct:', hasProduct);
        //         console.log('createAdjustmentDTO: ', createAdjustmentDTO);
        //         return this.create(createAdjustmentDTO, !hasProduct);
        //     })
        return this.adjustmentModel.upAdjustment(product, quantity, batchNumber, adjustmentAction, remarks, hospital);
    }

    async downAdjustment(product: Product, quantity: number, batchNumber: string,
                         adjustmentAction: AdjustmentActionEnums,
                         remarks: string = "", hospital: Hospital=null): Promise<Adjustment> {

        // const setupAdjustmentDTO: SetupAdjustmentDTO = new SetupAdjustmentDTO();
        // const createAdjustmentDTO: CreateAdjustmentDTO = setupAdjustmentDTO.setUpDTO(
        //     product, quantity, STOCK_ADJUST_DOWN, remarks, hospital);
        // return this.create(createAdjustmentDTO, false);

        return this.adjustmentModel.downAdjustment(
            product, quantity, batchNumber, adjustmentAction, remarks, hospital);
    }
}
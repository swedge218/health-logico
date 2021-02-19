import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Adjustment} from "./adjustment.entity";
import {CreateAdjustmentDTO} from "./dto/create-adjustment.dto";
import {AdjustmentMapper} from "./adjustment.mapper";
import {BaseModel} from "../../app.basemodel";
import {Product} from "../../product/domain/product.entity";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {
    STOCK_START_BATCH,
    STOCK_START_QUANTITY,
    STOCK_START_REMARK
} from "../../stock/domain/constants/stock.constants";
import {StockModel} from "../../stock/domain/stock.model";
import {AdjustmentActionEnums, AdjustmentTypeEnums} from "./enums/adjustment.type.enums";

@Injectable()
export class AdjustmentModel extends BaseModel{
    constructor(
        @InjectRepository(Adjustment)
        private readonly repository: Repository<Adjustment>,
        private stockModel: StockModel
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<Adjustment>> {
        return this.repository
            .createQueryBuilder('adjustment')
            .leftJoinAndSelect("adjustment.product", "product")
            .leftJoinAndSelect("product.manufacturer", "manufacturer")
            .leftJoinAndSelect("adjustment.hospital", "hospital")
            .leftJoinAndSelect("hospital.location", "location");
    }

    async findAll(options: any={}): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;
        const count = await this.repository.count();
        const SQB = await this.findTemplate();

        return SQB
            .orderBy('adjustment.id', 'DESC')
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return AdjustmentModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Adjustment> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    isValidAdjustmentType(adjType: string): boolean {
        return adjType === AdjustmentTypeEnums.DOWN
            || adjType === AdjustmentTypeEnums.UP
            || adjType === AdjustmentTypeEnums.INIT;
    }

    isValidAdjustmentAction(action: string): boolean {
        return action === AdjustmentActionEnums.INIT
            || action === AdjustmentActionEnums.ISSUE
            || action === AdjustmentActionEnums.PROCUREMENT
            || action === AdjustmentActionEnums.RECEIPT
            || action === AdjustmentActionEnums.SALE;
    }

    async save(createAdjustmentDTO: CreateAdjustmentDTO): Promise<Adjustment> {
        let adjustment: Adjustment = new AdjustmentMapper().fromDTO(createAdjustmentDTO);

        if(!this.isValidAdjustmentType(adjustment.adjustmentType)){
            throw new BadRequestException("Invalid adjustment type");
        }

        if(!this.isValidAdjustmentAction(adjustment.adjustmentAction)){
            throw new BadRequestException("Invalid adjustment action");
        }

        console.log('about to insert adjustment')
        return this.repository.save(adjustment)
            .then(async (adj) => {
                console.log('adj', adj);
                adjustment = await this.findOne(adj.id); //get adjustment with relations

                //update stock
                console.log('about to update stock')
                return await this.stockModel.update(adjustment).then(() => adjustment);
            })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }


    async registerProduct(product: Product): Promise<Adjustment> {

        const createAdjustmentDTO: CreateAdjustmentDTO = new AdjustmentMapper().toDTO(
            product, STOCK_START_QUANTITY, STOCK_START_BATCH, AdjustmentTypeEnums.INIT,
            AdjustmentActionEnums.INIT, STOCK_START_REMARK, null);
        return this.save(createAdjustmentDTO);
    }

    async upAdjustment(product: Product, quantity: number, batchNumber: string,
                       adjustmentAction: AdjustmentActionEnums,
                       remarks: string,hospital: Hospital=null): Promise<Adjustment> {

        const createAdjustmentDTO: CreateAdjustmentDTO = new AdjustmentMapper().toDTO(
            product, quantity, batchNumber, AdjustmentTypeEnums.UP,
            adjustmentAction, remarks, hospital);
        return this.save(createAdjustmentDTO);
    }

    async downAdjustment(product: Product, quantity: number, batchNumber: string,
                         adjustmentAction: AdjustmentActionEnums,
                         remarks: string, hospital: Hospital=null): Promise<Adjustment> {

        const createAdjustmentDTO: CreateAdjustmentDTO = new AdjustmentMapper().toDTO(
            product, quantity, batchNumber, AdjustmentTypeEnums.DOWN,
            adjustmentAction, remarks, hospital);
        return this.save(createAdjustmentDTO);
    }
}
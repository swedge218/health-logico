import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Stock} from "./stock.entity";
import {CreateStockDTO} from "./dto/create-stock.dto";
import {StockMapper} from "./stock.mapper";
import {Adjustment} from "../../adjustment/domain/adjustment.entity";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {BaseModel} from "../../app.basemodel";
import {AdjustmentTypeEnums} from "../../adjustment/domain/enums/adjustment.type.enums";
import {PriceModel} from "../../price/domain/price.model";
import {Functions} from "../../utils/functions";


@Injectable()
export class StockModel extends BaseModel{
    constructor(
        @InjectRepository(Stock)
        private readonly repository: Repository<Stock>,
        private priceModel: PriceModel
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<Stock>> {
        return this.repository
            .createQueryBuilder('stock')
            .leftJoinAndSelect("stock.product", "product")
            .leftJoinAndSelect("stock.hospital", "hospital")
    }

    async findAll(options: any): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;
        const count = await this.repository.count();
        const SQB = await this.findTemplate();

        return SQB
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return BaseModel.makePainationData(items, options, count);
            });
    }


    async findOne(id: number): Promise<any> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findStock(productId: number, batchNumber: string, hospitalId?: number): Promise<Stock> {

        //hospitalId = hospitalId === null || hospitalId === undefined ? null: hospitalId;
        hospitalId = Functions.isEmptyValue(hospitalId) ? null: hospitalId;

        return this.findTemplate().then(async (sqb) => {
            sqb.where("product_id = :productId", { productId: productId })
                .andWhere("batch_number = :batchNumber", { batchNumber: batchNumber });

            if(hospitalId === null) {
                sqb.andWhere("hospital_id IS NULL")
            } else {
                sqb.andWhere("hospital_id = :hospitalId", { hospitalId: hospitalId })
            }

            return await sqb.getOne();
        });
    }

    async facilityHasProductRegistered(productId: number, batchNumber: string,
                                       hospitalId: number): Promise<boolean> {

        return this.findStock(productId, batchNumber, hospitalId)
            .then(stock => {
                console.log('stock', stock);
                return stock instanceof Stock
            })
    }


    async findProductStock(productId: number, options: any,
                           hospitalId?: number): Promise<Stock[]> {

        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;

        hospitalId = Functions.isEmptyValue(hospitalId) ? null : hospitalId;

        //product name, sum of qty, hospital
        return this.findTemplate().then(async (sqb) => {
            sqb.select('stock.id', 'stock_id');
            sqb.addSelect('brand_name', 'product_name');
            sqb.addSelect('product.id', 'product_id');
            sqb.addSelect('batch_number', 'batch_number');
            sqb.addSelect('hospital.title', 'hospital_name');
            sqb.addSelect('SUM(quantity)', 'quantity');

            sqb.where("product_id = :productId", {productId: productId});

            if (hospitalId === null) {
                sqb.andWhere("hospital_id IS NULL")
            } else {
                sqb.andWhere("hospital_id = :hospitalId",
                    {hospitalId: hospitalId})
            }

            const count = await sqb.getMany().then(stock => stock.length);

            // const sql = sqb.skip(offset).take(limit).getSql();
            // console.log('sql', sqb.getSql(), count, hospitalId, productId, offset, limit);

            return sqb
                .groupBy('batch_number')
                .skip(offset)
                .take(limit)
                .getRawMany()
                .then(items => {
                    return BaseModel.makePainationData(items, options, count);
                });
        });
    }


    async findProductStockAggs(productId: number, options: any,
                               hospitalId?: number): Promise<Stock[]> {

        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;

        hospitalId = Functions.isEmptyValue(hospitalId) ? null : hospitalId;

        return this.findTemplate().then(async (sqb) => {
            sqb.select('stock.id', 'stock_id');
            sqb.addSelect('brand_name', 'product_name');
            sqb.addSelect('hospital.title', 'hospital_name');
            sqb.addSelect('SUM(quantity)', 'quantity');

            sqb.where("product_id = :productId", {productId: productId});

            if (hospitalId === null) {
                sqb.andWhere("hospital_id IS NULL")
            } else {
                sqb.andWhere("hospital_id = :hospitalId",
                    {hospitalId: hospitalId})
            }

            const count = await sqb.getMany().then(stock => stock.length);

            // const sql = sqb.skip(offset).take(limit).getSql();
            // console.log('sql', sqb.getSql(), count, hospitalId, productId, offset, limit);

            return sqb
                .skip(offset)
                .take(limit)
                .getRawMany()
                .then(items => {
                    return BaseModel.makePainationData(items, options, count);
                });
        });
    }


    async isStockedAndEnough(productId: number, batchNumber: string, hospitalId: any, quantity: number,
                             throwError: boolean = true): Promise<boolean> {
        return this.findStock(productId, batchNumber, hospitalId)
            .then( stock => {
                if(!stock && throwError){
                    throw new BadRequestException(this.stockFulfilmentFailureText(productId, batchNumber));
                }

                if(stock && stock.quantity >= quantity) return true;

                return false;
            })
    }

    stockFulfilmentFailureText(productId: number, batchNumber: string): string {
        return `Not enough stock to fulfil request. Product: ${productId}, Batch: ${batchNumber}. Are you sure this is the correct stock number?`;
    }

    async save(createStockDTO: CreateStockDTO): Promise<Stock> {
        const stock: Stock = new StockMapper().fromDTO(createStockDTO);
        return this.repository.save(stock)
            .then(stock => stock)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async setupInitialRegistration(adjustment:Adjustment): Promise<Stock> {
        const dto: CreateStockDTO = new StockMapper().fromAdjustment(adjustment);
        return this.save(dto).then(async (stock) => {
            //if(adjustment.hospital === null) await this.priceModel.setUpStockPrice(stock);
            return stock;
        })
    }

    async update(adjustment: Adjustment): Promise<any> {
        const productId = adjustment.product.id;
        const adjustmentType = adjustment.adjustmentType;
        const batchNumber = adjustment.batchNumber;
        let hospital =  adjustment.hospital;
        let hospitalId = 0;
        let adjustmentQuantity = adjustment.quantity;

        if(hospital instanceof Hospital) {
            hospitalId = hospital.id;
        } else {
            hospitalId = null;
        }

        const stocked = await this.facilityHasProductRegistered(productId, batchNumber, hospitalId);

        if (!stocked) {
            console.log('Product batch NOT registered');
            return this.setupInitialRegistration(adjustment);
        } else {
            console.log('Product batch registered');
            if (adjustmentType == AdjustmentTypeEnums.DOWN) {
                adjustmentQuantity = adjustmentQuantity * (-1);
                console.log('adjustmentQuantity: ', adjustmentQuantity);
            }

            const query = this.repository
                .createQueryBuilder()
                .update(Stock)
                .set({
                    product: adjustment.product,
                    quantity: () => "quantity + " + adjustmentQuantity
                })
                .where("product_id = :product_id", {product_id: productId})
                .andWhere("batch_number = :batchNumber",
                    { batchNumber: batchNumber });


            if (hospitalId === null) {
                query.andWhere("hospital_id IS NULL")
            } else {
                query.andWhere("hospital_id = :hospital_id", {hospital_id: hospitalId})
            }

            return query.execute();
        }
    }
}
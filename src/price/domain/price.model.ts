import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {Price} from "./price.entity";
import {CreatePriceDTO} from "./dto/create-price.dto";
import {PriceMapper} from "./price.mapper";
import {BaseModel} from "../../app.basemodel";
import {Stock} from "../../stock/domain/stock.entity";

@Injectable()
export class PriceModel extends BaseModel {
    constructor(
        @InjectRepository(Price)
        private readonly repository: Repository<Price>
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<Price>> {
        return this.repository
            .createQueryBuilder('price')
            .leftJoinAndSelect("price.product", "product");
            // .leftJoinAndSelect("price.stock", "stock")
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
                return PriceModel.makePainationData(items, options, count);
            });
    }


    async findAllNoPrice(options: any): Promise<any> {
        const page: number = Number(options.page);
        const limit: number = Number(options.limit);
        const offset = (page - 1) * limit;
        const count = await this.repository.count({unitCost: 0});
        const SQB = await this.findTemplate();

        return SQB
            .where({unitCost: 0})
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return PriceModel.makePainationData(items, options, count);
            });
    }


    async findOne(id: number): Promise<Price> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findPrice(productId: number, batchNumber: string, throwError: boolean = true): Promise<number> {
        return this.findTemplate().then(sqb => {
            return sqb.select('unit_cost')
                .where({product: productId, batchNumber: batchNumber})
                .getRawOne()
                .then(price => {
                    if (!price && throwError){
                        this.priceNotSetErrorText(productId, batchNumber);
                    }

                    return price['unit_cost']
                })
        });
    }

    async findRelatedData(id: number): Promise<Price> {
        const prices: Price[] = await this.repository.find({
            join: {
                alias: 'proc',
                innerJoinAndSelect: {
                    priceItem: "proc.priceItems",
                    product: "priceItem.product"
                },
            },
            where: {id: id},
        });

        return prices[0];
    }

    async save(createPriceDTO: CreatePriceDTO): Promise<Price> {
        const price: Price = new PriceMapper().fromDTO(createPriceDTO);
        return this.repository.save(price)
            .then(price => price)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async setUpStockPrice(stock: Stock): Promise<Price> {
        const createPriceDTO: CreatePriceDTO = new PriceMapper().toDTO(stock);
        return this.save(createPriceDTO);
    }

    priceNotSetErrorText(productId: number, batchNumber: string): string {
        return `Price not set for Product: ${productId}, Batch: ${batchNumber}`;
    }

    async update(id: number, createPriceDTO: CreatePriceDTO): Promise<Price> {
        const price: Price = new PriceMapper().fromDTO(createPriceDTO);
        return this.repository.update(id,  price)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
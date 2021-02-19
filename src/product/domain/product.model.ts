import {InjectRepository} from "@nestjs/typeorm";
import {InternalServerErrorException} from "@nestjs/common";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {Product} from "./product.entity";
import {CreateProductDTO} from "./dto/create.product.dto";
import {ProductMapper} from "./product.mapper";
import {BaseModel} from "../../app.basemodel";
import {Functions} from "../../utils/functions";

export class ProductModel extends BaseModel{
    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<Product>> {
        return this.repository
            .createQueryBuilder('product')
            .leftJoinAndSelect("product.manufacturer", "manufacturer");
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
                return ProductModel.makePainationData(items, options, count);
            });
    }

    async findFullDetails(id: number, hospitalId: number): Promise<any[]> {
        // prodcurement items
        // price
        // stock
        /**
         * Product Generic Name:
         - Product Brand Name:
         - Strength
         - Formulation:
         - Unit Size:
         - Expiry Date:
         - Batch Number/UID:
         - Strength:
         - Formulation:
         - Manufacturer:
         - Quantity Available by SKU:
         - Expiry Date:
         - Unit Cost:
         - Consumption Rate:
         - Months of Stock on Hand:
         */

        hospitalId = Functions.isEmptyValue(hospitalId) ? null : hospitalId;

        return this.findTemplate()
            .then(sqb => {
                sqb.leftJoinAndSelect(
                    "product.procurementItem", "procItems")
                    .leftJoinAndSelect("product.price", "price")
                    .leftJoinAndSelect("product.stock", "stock")
                    .leftJoinAndSelect("stock.hospital", "hospital")
                    .select("manufacturer.title")
                    .addSelect("product.id", "product_id")
                    .addSelect("product.generic_name", "generic_name")
                    .addSelect("product.brand_name", "product_name")
                    .addSelect("product.formulation", "formulation")
                    .addSelect("product.strength", "strength")
                    .addSelect("stock.batch_number", "batch_number")
                    .addSelect("procItems.expiry_date", "expiry_date")
                    .addSelect("price.unit_cost", "unit_cost")
                    .addSelect("stock.quantity", "quantity")
                    .addSelect("hospital.title", "hospital_name")
                    .where("product.id = :pId",{pId: id});

                if (hospitalId === null) {
                    sqb.andWhere("hospital_id IS NULL")
                } else {
                    sqb.andWhere("hospital_id = :hID", {hID: hospitalId})
                }

                console.log('sql', sqb.getSql());
                return sqb.groupBy("batch_number").getRawMany();
            });
    }

    async findOne(id: number): Promise<Product> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    // async findOne(id: number): Promise<Product> {
    //     return this.findTemplate().then(sqb => {
    //         return sqb.leftJoinAndSelect('product.stock', "stock")
    //             .where("product.id = :pId", {pId: id})
    //             .andWhere("hospital_id")
    //             .getOne()
    //     });
    // }

    async save(createProductDTO: CreateProductDTO): Promise<Product> {
        const product: Product = new ProductMapper().fromDTO(createProductDTO);
        return this.repository.save(product)
            .then(product => product)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createProductDTO: CreateProductDTO): Promise<Product> {
        const product: Product = new ProductMapper().fromDTO(createProductDTO);
        return this.repository.update(id,  product)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
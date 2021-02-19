import { Injectable } from '@nestjs/common';
import {ProductModel} from "./domain/product.model";
import {Product} from "./domain/product.entity";
import {CreateProductDTO} from "./domain/dto/create.product.dto";
import {AdjustmentService} from "../adjustment/adjustment.service";

@Injectable()
export class ProductService {
    constructor(
        private productModel: ProductModel,
        private adjustmentService: AdjustmentService
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.productModel.findAll(options);
    }

    async findOne(id: number): Promise<Product> {
        return this.productModel.findOne(id);
    }

    async findFullDetails(productId: number, hospitalId): Promise<any[]> {
        return this.productModel.findFullDetails(productId, hospitalId);
    }

    async create(createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productModel.save(createProductDTO)
            .then(async product => {
                await this.adjustmentService.registerProduct(product);
                return product;
            })
    }

    async update(id: number, createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productModel.update(id,  createProductDTO);
    }

    async remove(id: number): Promise<any> {
        return this.productModel.remove(id);
    }
}
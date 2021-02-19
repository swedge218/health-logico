import {forwardRef, Module} from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./domain/product.entity";
import {ManufacturerModule} from "../manufacturer/manufacturer.module";
import {ProductModel} from "./domain/product.model";
import {AdjustmentModule} from "../adjustment/adjustment.module";

@Module({
    imports: [
        ManufacturerModule,
        forwardRef(() => AdjustmentModule),
        TypeOrmModule.forFeature([Product])],
    controllers: [ProductController],
    providers: [ProductService, ProductModel],
    exports: [ProductModel]
})
export class ProductModule {}

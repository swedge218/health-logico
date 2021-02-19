import {forwardRef, Module} from '@nestjs/common';
import { InvoiceItemController } from './invoice-item.controller';
import { InvoiceItemService } from './invoice-item.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {InvoiceItem} from "./domain/invoice-item.entity";
import {InvoiceItemModel} from "./domain/invoice-item.model";
import {InvoiceModule} from "../invoice/invoice.module";
import {ProductModule} from "../product/product.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([InvoiceItem]),
        forwardRef(() => InvoiceModule),
        ProductModule
    ],
    controllers: [InvoiceItemController],
    providers: [InvoiceItemService, InvoiceItemModel],
    exports: [InvoiceItemModel]
})
export class InvoiceItemModule {}

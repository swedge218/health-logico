import {forwardRef, Module} from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Invoice} from "./domain/invoice.entity";
import {InvoiceModel} from "./domain/invoice.model";
import {ProductModule} from "../product/product.module";
import {UserModule} from "../user/user.module";
import {InvoiceItemModule} from "../invoice-item/invoice-item.module";
import {PaymentModule} from "../payment/payment.module";
import {PriceModule} from "../price/price.module";
import {StockModule} from "../stock/stock.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Invoice]),
        ProductModule,
        UserModule,
        PriceModule,
        InvoiceItemModule,
        StockModule,
        forwardRef(() => PaymentModule)
    ],
    controllers: [InvoiceController],
    providers: [InvoiceService, InvoiceModel],
    exports: [InvoiceModel]
})
export class InvoiceModule {}

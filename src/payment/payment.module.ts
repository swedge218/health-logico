import {forwardRef, Module} from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Payment} from "./domain/payment.entity";
import {PaymentModel} from "./domain/payment.model";
import {NIBSSPaymentModel} from "./domain/nibbs-payment.model";
import {PayclusterPaymentModel} from "./domain/paycluster-payment.model";
import {AdjustmentModule} from "../adjustment/adjustment.module";
import {InvoiceModule} from "../invoice/invoice.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment]),
        AdjustmentModule,
        forwardRef(() => InvoiceModule)
    ],
    controllers: [PaymentController],
    providers: [PaymentService, PaymentModel, NIBSSPaymentModel, PayclusterPaymentModel],
    exports: [PaymentModel]
})
export class PaymentModule {}

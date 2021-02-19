import { Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PermissionModule} from "./permission/permission.module";
import { RoleModule } from './role/role.module';
import {UserModule} from "./user/user.module";
import { AuthModule } from './auth/auth.module';
import { HospitalModule } from './hospital/hospital.module';
import { LocationModule } from './location/location.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrderItemModule } from './order-item/order-item.module';
import { NotificationModule } from './notification/notification.module';
import { UtilsModule } from './utils/utils.module';
import { PatientModule } from './patient/patient.module';
import { CancerTypeModule } from './cancer-type/cancer-type.module';
import { CancerStageModule } from './cancer-stage/cancer-stage.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { PrescriptionItemModule } from './prescription-item/prescription-item.module';
import { NotificationTypeModule } from './notification-type/notification-type.module';
import { NotificationSubsService } from './notification-subs/notification-subs.service';
import { NotificationSubsModule } from './notification-subs/notification-subs.module';
import { DeliveryStatusModule } from './delivery-status/delivery-status.module';
import { ProcurementModule } from './procurement/procurement.module';
import { ProcurementItemModule } from './procurement-item/procurement-item.module';
import { AdjustmentModule } from './adjustment/adjustment.module';
import { StockModule } from './stock/stock.module';
import { StockIssueModule } from './stock-issue/stock-issue.module';
import { StockIssueItemModule } from './stock-issue-item/stock-issue-item.module';
import { StockReceiptModule } from './stock-receipt/stock-receipt.module';
import { StockReceiptItemModule } from './stock-receipt-item/stock-receipt-item.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentModule } from './payment/payment.module';
import { InvoiceItemModule } from './invoice-item/invoice-item.module';
import { PriceModule } from './price/price.module';
import { ReportsModule } from './reports/reports.module';
import { SeederModule } from './seeder/seeder.module';
import { ClientModule } from './client/client.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '/var/env/.cap.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            autoLoadEntities: true,
            synchronize: true,
            // logging: true
        }),
        UserModule,
        PermissionModule,
        RoleModule,
        AuthModule,
        HospitalModule,
        LocationModule,
        ManufacturerModule,
        ProductModule,
        OrderModule,
        OrderStatusModule,
        OrderItemModule,
        NotificationModule,
        UtilsModule,
        PatientModule,
        CancerTypeModule,
        CancerStageModule,
        PrescriptionModule,
        PrescriptionItemModule,
        NotificationTypeModule,
        // NotificationSubsModule,
        DeliveryStatusModule,
        ProcurementModule,
        ProcurementItemModule,
        AdjustmentModule,
        StockModule,
        StockIssueModule,
        StockIssueItemModule,
        StockReceiptModule,
        StockReceiptItemModule,
        InvoiceModule,
        PaymentModule,
        InvoiceItemModule,
        PriceModule,
        ReportsModule,
        SeederModule,
        ClientModule],
    controllers: [AppController],
    providers: [
        AppService,
        NotificationSubsService,
    ],
})
export class AppModule {}

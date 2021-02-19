import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from '@nestjs/typeorm';
import {Payment} from "../domain/payment.entity";
import {PaymentModel} from "../domain/payment.model";
import {Logger, UnprocessableEntityException} from "@nestjs/common";
import {PaymentRepositoryFake} from "./payment.repository.fake";
import {Column, Connection, JoinColumn, ManyToOne, Repository} from "typeorm";
import {PaymentStatusEnum} from "../domain/enums/payment-status.enum";
import {PaymentChannelsEnum} from "../domain/enums/payment-channels.enum";
import {AdjustmentModel} from "../../adjustment/domain/adjustment.model";
import {InvoiceModel} from "../../invoice/domain/invoice.model";
import {Adjustment} from "../../adjustment/domain/adjustment.entity";
import {Invoice} from "../../invoice/domain/invoice.entity";
import {StockModel} from "../../stock/domain/stock.model";
import {Stock} from "../../stock/domain/stock.entity";
import {PriceModel} from "../../price/domain/price.model";
import {Price} from "../../price/domain/price.entity";
import {InvoiceItemModel} from "../../invoice-item/domain/invoice-item.model";
import {InvoiceItem} from "../../invoice-item/domain/invoice-item.entity";
import {NIBSSPaymentModel} from "../domain/nibbs-payment.model";
import {ALREADY_DONE_TEXT, UNDERPAYMENT_TEXT} from "../domain/constants/payment.constants";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {User} from "../../user/domain/user.entity";


describe('NIBSS PaymentModel', () => {
    let paymentModel: PaymentModel;
    let nibssPaymentModel: NIBSSPaymentModel;
    let paymentRepository: Repository<Payment>;
    const logger = new Logger('PaymentModel');
    const faker = require('faker');

    const mockConnection = () => ({
        transaction: jest.fn()
    });

    const mockRepository = jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
            offset: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            //getManyAndCount: jest.fn().mockReturnValueOnce(<expected response>),
        })),
    }));

    const mockQuerybuilder = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnThis(),
        subQuery: jest.fn().mockReturnThis(),
    }));

    const foundPayment = {
        id: faker.random.number(),
        invoiceNumber: faker.lorem.word(),
        statusCode: faker.lorem.word(),
        statusDescription: faker.lorem.word(),
        invoiceAmount: faker.finance.amount(),
        paidAmount: faker.finance.amount(),
        currency: faker.lorem.word(),
        type: faker.lorem.word(),
        transactionReference: faker.lorem.word(),
        cardScheme: faker.lorem.word(),
        customerName: `${faker.name.firstName()} ${faker.name.firstName()}`,
        maskedPAN: faker.lorem.word(),
        retrievalReferenceNumber: faker.lorem.word(),
        createdDate: new Date(),
        createdBy: faker.random.number(),
        modifiedDate: new Date(),
        modifiedBy: faker.random.number(),
        deletedDate: null,
        version: 0,
        paymentDate: faker.lorem.word(),
        status: PaymentStatusEnum.SUCCESSFUL,
        channel: PaymentChannelsEnum.NIBSS,
        // invoice: faker.random.number(),
        invoice: {
            id: faker.random.number(),
            invoiceNumber: faker.lorem.word(),
            hospital: new Hospital(),
            saleOfficer: new User(),
            payment: new Payment(),
            invoiceItems: [new InvoiceItem()],
            createdBy: faker.random.number(),
            createdDate: new Date(),
            modifiedBy: faker.random.number(),
            modifiedDate: new Date(),
            deletedDate: new Date(),
            version: faker.random.number(),
        }
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentModel,
                {
                    provide: getRepositoryToken(Payment),
                    useClass: PaymentRepositoryFake,
                },
                AdjustmentModel,
                {
                    provide: getRepositoryToken(Adjustment),
                    useClass: PaymentRepositoryFake,
                },
                StockModel,
                {
                    provide: getRepositoryToken(Stock),
                    useClass: PaymentRepositoryFake,
                },
                PriceModel,
                {
                    provide: getRepositoryToken(Price),
                    useClass: PaymentRepositoryFake,
                },
                InvoiceModel,
                {
                    provide: getRepositoryToken(Invoice),
                    useClass: PaymentRepositoryFake,
                },
                {
                    provide: Connection,
                    useValue: mockConnection
                },
                InvoiceItemModel,
                {
                    provide: getRepositoryToken(InvoiceItem),
                    useClass: PaymentRepositoryFake,
                },
                NIBSSPaymentModel

            ]
        }).compile();

        paymentModel = module.get<PaymentModel>(PaymentModel);
        nibssPaymentModel = module.get<NIBSSPaymentModel>(NIBSSPaymentModel);
        paymentRepository = module.get(getRepositoryToken(Payment));
    });

    it('can find payment by invoice number', async () => {
        const invoiceNumber = faker.lorem.word();

        const mockSQB: any = {
            createQueryBuilder: () => mockSQB,
            leftJoinAndSelect: () => mockSQB,
            where: () => mockSQB,
            getOne: () => foundPayment
        };

        const findTemplateSpy = jest.spyOn(paymentModel, 'findTemplate').mockResolvedValue(mockSQB);

        const payment = await paymentModel.findByInvoiceNumber(invoiceNumber);

        expect(findTemplateSpy).toHaveBeenCalled();
        expect(payment).toEqual(foundPayment);
    })

    it('throws error when calling notify with payment not on PENDING status', async () => {
        foundPayment.status = PaymentStatusEnum.SUCCESSFUL;
        const dto = {
            orderId: faker.random.number(),
            amount: faker.finance.amount(),
            referenceId: faker.lorem.word()
        }

        const result = await nibssPaymentModel.notify(foundPayment, dto);

        expect(result.statusCode).toBe(422);
        expect(result.message).toBe(ALREADY_DONE_TEXT);
    });


    it('throws error when calling notify with amount less than payment amount', async () => {
        const invoiceAmount = 5000;
        const paidAmount = invoiceAmount - 1000;
        foundPayment.status = PaymentStatusEnum.PENDING;
        foundPayment.invoiceAmount = invoiceAmount;

        const dto = {
            orderId: faker.random.number(),
            amount: paidAmount,
            referenceId: faker.lorem.word()
        };

        const result = await nibssPaymentModel.notify(foundPayment, dto);

        expect(result.statusCode).toBe(422);
        expect(result.message).toBe(UNDERPAYMENT_TEXT);
    });


    it('can notify and save NIBSS payment', async () => {
        foundPayment.status = PaymentStatusEnum.PENDING;
        const invoiceId = faker.random.number();

        const dto = {
            orderId: faker.random.number(),
            amount: foundPayment.invoiceAmount,
            referenceId: faker.lorem.word()
        };

        const responseMock = {
            statusCode: 204,
            status: PaymentStatusEnum.SUCCESSFUL
        }

        const nibssPaymentModelStockSpy = jest.spyOn(nibssPaymentModel, 'updateStock');
        const nibssPaymentModelSaveSpy = jest.spyOn(paymentRepository, 'save').mockResolvedValue(foundPayment);

        const result = await nibssPaymentModel.notify(foundPayment, dto);

        expect(nibssPaymentModelSaveSpy).toBeCalledWith(foundPayment);
        expect(nibssPaymentModelStockSpy).toBeCalledWith(foundPayment.invoice.id)
        expect(result).toEqual(responseMock);

    });

})
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from '@nestjs/typeorm';
import {Payment} from "../domain/payment.entity";
import {PaymentModel} from "../domain/payment.model";
import {PaymentRepositoryFake} from "./payment.repository.fake";
import {Connection, Repository} from "typeorm";
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
import {ALREADY_DONE_TEXT, UNDERPAYMENT_TEXT} from "../domain/constants/payment.constants";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {User} from "../../user/domain/user.entity";
import {PayclusterPaymentModel} from "../domain/paycluster-payment.model";


describe('PayCluster PaymentModel', () => {
    let paymentModel: PaymentModel;
    let payclusterPaymentModel: PayclusterPaymentModel;
    let paymentRepository: Repository<Payment>;
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
        channel: PaymentChannelsEnum.PAYCLUSTER,
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
                PayclusterPaymentModel,

            ]
        }).compile();

        paymentModel = module.get<PaymentModel>(PaymentModel);
        payclusterPaymentModel = module.get<PayclusterPaymentModel>(PayclusterPaymentModel);
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
            Reference: faker.lorem.word(),
            Amount: faker.finance.amount(),
            Currency: faker.lorem.word(),
            Type: faker.lorem.word(),
            TransactionRefrence: faker.lorem.word(),
            MaskedPAN: faker.lorem.word(),
            CardScheme: faker.lorem.word(),
            CustomerName: faker.lorem.word(),
            StatusCode: faker.lorem.word(),
            RetrievalReferenceNumber: faker.lorem.word(),
            StatusDescription: faker.lorem.word(),
            PaymentDate: faker.lorem.word(),
        }

        const result = await payclusterPaymentModel.notify(foundPayment, dto);

        expect(result.statusCode).toBe(409);
        expect(result.message).toBe(ALREADY_DONE_TEXT);
    });


    it('throws error when calling notify with amount less than payment amount', async () => {
        const invoiceAmount = 5000;
        const paidAmount = invoiceAmount - 1000;
        foundPayment.status = PaymentStatusEnum.PENDING;
        foundPayment.invoiceAmount = invoiceAmount;

        const dto = {
            Reference: faker.lorem.word(),
            Amount: String(paidAmount),
            Currency: faker.lorem.word(),
            Type: faker.lorem.word(),
            TransactionRefrence: faker.lorem.word(),
            MaskedPAN: faker.lorem.word(),
            CardScheme: faker.lorem.word(),
            CustomerName: faker.lorem.word(),
            StatusCode: faker.lorem.word(),
            RetrievalReferenceNumber: faker.lorem.word(),
            StatusDescription: faker.lorem.word(),
            PaymentDate: faker.lorem.word(),
        }

        const result = await payclusterPaymentModel.notify(foundPayment, dto);

        expect(result.statusCode).toBe(422);
        expect(result.message).toBe(UNDERPAYMENT_TEXT);
    });


    it('can notify and save Paycluster payment', async () => {
        foundPayment.status = PaymentStatusEnum.PENDING;
        const invoiceId = faker.random.number();

        const dto = {
            Reference: faker.lorem.word(),
            Amount: foundPayment.invoiceAmount,
            Currency: faker.lorem.word(),
            Type: faker.lorem.word(),
            TransactionRefrence: faker.lorem.word(),
            MaskedPAN: faker.lorem.word(),
            CardScheme: faker.lorem.word(),
            CustomerName: faker.lorem.word(),
            StatusCode: faker.lorem.word(),
            RetrievalReferenceNumber: faker.lorem.word(),
            StatusDescription: faker.lorem.word(),
            PaymentDate: faker.lorem.word(),
        }

        const responseMock = {
            statusCode: 200,
            BillerReference: foundPayment.invoiceNumber
        }

        const stockSpy = jest.spyOn(payclusterPaymentModel, 'updateStock');
        const saveSpy = jest.spyOn(paymentRepository, 'save').mockResolvedValue(foundPayment);

        const result = await payclusterPaymentModel.notify(foundPayment, dto);

        expect(saveSpy).toBeCalledWith(foundPayment);
        expect(stockSpy).toBeCalledWith(foundPayment.invoice.id)
        expect(result).toEqual(responseMock);

    });

})
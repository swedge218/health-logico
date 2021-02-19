import {
    Body,
    Controller,
    Get, HttpCode, HttpStatus,
    Injectable,
    Param,
    Post,
    Put,
    Query,
    Req, Res,
    UnprocessableEntityException,
    Logger
} from '@nestjs/common';
import { CreatePaymentDTO } from './domain/dto/create-payment.dto';
import { Payment } from './domain/payment.entity';
import { PaymentService } from './payment.service';
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {NIBSSNotificationDTO} from "./domain/dto/nibss-notification.dto";
import {PayclusterNotificationDTO} from "./domain/dto/paycluster-notification.dto";
import {Public} from "../auth/decorators/public.decorator";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {RequestHeader} from "../validators/header.variable.validator";
import {ClientAuthDTO} from "../client/domain/dto/client.auth.dto";

@Controller('v1/payment')
@Injectable()
export class PaymentController {
    private readonly logger = new Logger(PaymentController.name);

    constructor(private readonly paymentService: PaymentService) {}

    @RequiredPermissions(PermissionsEnum.VIEW_PAYMENT)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.paymentService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PAYMENT)
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Payment> {
        return this.paymentService.findOne(id)
            .then(payment => {
                return ResponseBuilder.makeFindResponder(payment);
            })
    }

    @Public()
    @Get(':invoiceNumber/status')
    findPaymentStatus(@Param('invoiceNumber') invoiceNumber: string,
                      @RequestHeader(ClientAuthDTO) clientAuthDTO: ClientAuthDTO): Promise<Payment> {

        return this.paymentService.findStatus(invoiceNumber)
            .then(payment => {
                return ResponseBuilder.makeFindResponder(payment);
            })
            .catch(e => {
                throw new UnprocessableEntityException(e)
            })
    }


    @RequiredPermissions(PermissionsEnum.VIEW_PAYMENT)
    @Get('/invoice/:invoiceNumber')
    findByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string): Promise<Payment> {
        return this.paymentService.findByInvoiceNumber(invoiceNumber)
            .then(payment => {
                return ResponseBuilder.makeFindResponder(payment);
            })
    }


    @RequiredPermissions(PermissionsEnum.CREATE_PAYMENT)
    @Post()
    create(@Body() createPaymentDTO: CreatePaymentDTO): Promise<Payment> {
        return this.paymentService.create(createPaymentDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_PAYMENT)
    @Put(':id')
    update(@Param('id') id: number,
           @Body() createPaymentDTO: CreatePaymentDTO): Promise<any> {
        return this.paymentService.update(id,  createPaymentDTO);
    }

    @Public()
    @Post('/notification/:refId')
    nibssNotify(@Param('refId') refId: string,
                @RequestHeader(ClientAuthDTO) clientAuthDTO: ClientAuthDTO,
                @Body() nibssNotificationDTO: NIBSSNotificationDTO,
                @Res() response): any {

        nibssNotificationDTO.referenceId = refId;
        return this.paymentService.notifyNIBSS(nibssNotificationDTO)
            .then(result => {
                return ResponseBuilder.makeNIBSSResponse(response, result);
            })
    }

    @Public()
    @Post('/api/notification')
    payclusterNotify(@Body() payclusterNotificationDTO: PayclusterNotificationDTO,
                     @RequestHeader(ClientAuthDTO) clientAuthDTO: ClientAuthDTO,
                     @Res() response): Promise<any> {

        return this.paymentService.notifyPayCluster(payclusterNotificationDTO)
            .then(result => {
                return ResponseBuilder.makePayClusterResponse(response, result);
            })
    }
}
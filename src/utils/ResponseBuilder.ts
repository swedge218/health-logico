import {
    ArgumentsHost,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import {AllExceptionsFilter} from "../exception/all.exception";
import {PaymentNotificationResponseDTO} from "../payment/domain/dto/payment-notification-response.dto";

export class ResponseBuilder {

    static makeOKResponse(msg: string=''): any {
        const defaultMessage = 'OK;';

        const status = 200;
        return {
            message: (msg === '') ? defaultMessage : msg,
            statusCode: status
        }
    }

    static makeNIBSSResponse(response, result:PaymentNotificationResponseDTO): any {
        return response.status(result.statusCode).send(result);
    }

    static makePayClusterResponse(response, result:PaymentNotificationResponseDTO): any {
        const transformedResult = {...result, code: result.statusCode}
        return response.status(result.statusCode).send(transformedResult);
    }

    static makeFindResponder (entity: any) {
        if(entity)
            return entity;
        else if(entity == undefined)
            throw new NotFoundException();
        else if (entity instanceof HttpException)
            return new AllExceptionsFilter();
        else
            throw new InternalServerErrorException();
    }
}
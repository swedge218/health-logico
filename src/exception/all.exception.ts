import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        // console.log('Start:', JSON.stringify(exception));
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;


        response.status(status).json({
            message: this.messageBuilder(exception),
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }

    messageBuilder(exception: any): string {
        // console.log('EXCEPTION:',exception);
        let message: any = exception.message;
        const errorMessage = exception.errorMessage;
        const response = exception.response;

        //Validation error
        if (response !== undefined){
            if(response.message !== undefined) {
                return response.message;
            }
        }

        if(message !== undefined) {
            return message;
        }
        else if(errorMessage !== undefined) {

            if (errorMessage.hasOwnProperty("sqlState")) {
                return errorMessage['sqlMessage'];

            }
            else if (errorMessage.hasOwnProperty("message")) {
                return errorMessage['message'];
            }
            else {
                return errorMessage;
            }
        } else {
            return 'Unrecognized error';
        }
    }
}
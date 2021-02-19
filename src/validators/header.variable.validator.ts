import {BadRequestException, createParamDecorator, ExecutionContext} from '@nestjs/common'
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validateOrReject, validate } from 'class-validator';

export const RequestHeader = createParamDecorator(
    async (value:  ClassType<unknown>, ctx: ExecutionContext) => {

        // extract headers
        const headers = ctx.switchToHttp().getRequest().headers;

        // Convert headers to DTO object
        const dto = await plainToClass(value, headers, { excludeExtraneousValues: true });
        // console.log('DTP', dto);

        // Validate
        const validationResult = await validate(dto);
        if(validationResult.length > 0) {
            const errorObject = {
                errorType: 'Validation',
                value: validationResult[0]['value'],
                message: validationResult[0]['constraints'],
            }

            throw new BadRequestException(errorObject);
        }


        // return header dto object
        return dto;
    },
);
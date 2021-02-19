import { NestFactory } from '@nestjs/core';
import {ValidationPipe, ValidationError, BadRequestException} from "@nestjs/common";
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from "./exception/all.exception";
import {useContainer, Validator} from "class-validator";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    });
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
            const errorObject = {
                errorType: 'Validation',
                value: validationErrors[0]['value'],
                message: validationErrors[0]['constraints'],
            }

            //console.log("ERRORS: ", JSON.stringify(validationErrors));
            throw new BadRequestException(errorObject);
        },
        // dismissDefaultMessages: false,
        // disableErrorMessages: false,
        validationError: {target: false}
    }));

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const options = new DocumentBuilder()
        .setTitle('CAP-IMAS')
        .setDescription('The CAP-IMAS API docs')
        .setVersion('0.1')
        .addTag('Endpoints')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    // await app.enableCors({origin: true })
    console.log('HOST ENV: ', process.env.HOST);
    await app.listen(3000);
}
bootstrap();

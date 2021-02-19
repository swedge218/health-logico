import {NestFactory} from "@nestjs/core";
import {SeederModule} from "./seeder/seeder.module";
import {SeederService} from "./seeder/seeder.service";
import {Logger} from "@nestjs/common";

async function bootstrap() {
    await NestFactory.createApplicationContext(SeederModule)
        .then(async appContext => {
            const logger = await appContext.get(Logger);
            const seeder = await appContext.get(SeederService);

            await seeder
                .seed()
                .then(() => {
                    logger.debug('Seeding complete!');
                })
                .catch(error => {
                    logger.error('Seeding failed!');
                    throw error;
                })
                .finally(() => {
                    logger.debug('App Context Closing')
                    appContext.close()
                });
        })
        .catch(error => {
            throw error;
        });
}
bootstrap();
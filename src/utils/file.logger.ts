const winston = require('winston');
require('winston-daily-rotate-file');

export class FileLogger {
    errorFileTransport = new (winston.transports.DailyRotateFile)({
        filename: 'logs/%DATE%-error.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '180d'
    });

    combinedFileTransport = new (winston.transports.DailyRotateFile)({
        filename: 'logs/%DATE%-combined.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '180d'
    });

    emailFileTransport = new (winston.transports.File)({
        filename: 'logs/email.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '180d'
    });

    logger(): any {
        return winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
                //new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                //new winston.transports.File({ filename: 'logs/combined.log' }),
                this.errorFileTransport,
                this.combinedFileTransport
            ],
        });
    }


    emailLogger(): any {
        return winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'email-service' },
            transports: [
                this.emailFileTransport
            ],
        });
    }

    loggerDate = () => {
        var date = new Date();
        var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
            .toISOString()
            .split("T")

        var dateTime = dateString[0] + " " + (dateString[1].split('Z')[0])
        return dateTime;
    }

    // writeDataGenerationStartLog = (locationName, tierType) => {
    //     const date = this.loggerDate();
    //     this.logger.info(`${date}: Begin generating ${locationName} ${tierType} data`);
    // }

    async writeEmailLog (emailTitle: string, status: string, extraData: any): Promise<any> {
        const date = this.loggerDate();
        this.emailLogger().info(`${date}: Title - ${emailTitle} \n
                                Status - ${status} \n
                                Data - ${JSON.stringify(extraData)}`);
    }
}
import fs from 'fs';

export class StringsHelper {
    static encodeToBase64(str): string {
        return Buffer.from(str, 'utf8').toString('base64');
    }

    static decodeFromBase64(str): string {
        return Buffer.from(str, 'base64').toString('utf8');
    }

    static encodeBinaryToBase64(pathToBinaryFile): string {
        return fs.readFileSync(pathToBinaryFile).toString('base64');
    }

    static decodeBinaryFromBase64(binaryDataString, savePath): void {
        let buff = Buffer.from(binaryDataString, 'base64');
        fs.writeFileSync(savePath, buff);
    }
}
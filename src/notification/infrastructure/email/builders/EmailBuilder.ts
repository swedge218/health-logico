import {EMAIL_TEMPLATES_DIR} from "../constants/TemplateConstants";
import fs from 'fs';

export class EmailBuilder {

    loadTemplate(templateFileName: string) : Promise<string> {
        const path = EMAIL_TEMPLATES_DIR + templateFileName;

        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if(err){
                    return reject(err);
                }
                resolve(data.toString())
            });
        });
    }
}
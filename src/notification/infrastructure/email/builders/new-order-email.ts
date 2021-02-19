import {Order} from "../../../../order/domain/order.entity";
import stringInject from 'stringinject';
import {
    EMAIL_ADMIN,
    NEW_ORDER_EMAIL,
    EMAIL_NEW_ORDER_SUBJECT, EMAIL_NEW_ORDER_TEMPLATE, EMAIL_TEMPLATE_LOADED, EMAIL_TEMPLATE_NOT_LOADED
} from "../constants/TemplateConstants";
import {StringsHelper} from "../../../../utils/helpers/StringsHelper";
import {FileLogger} from "../../../../utils/file.logger";
import {EmailBuilder} from "./EmailBuilder";

export class NewOrderEMailBuilder extends EmailBuilder {

    logger: FileLogger = new FileLogger();

    createEmailData(order: Order, options: any, htmlString: string): any {
        // const emailFunction = (htmlString) => {

        const id = StringsHelper.encodeToBase64(order.id);
        const orderUrl = `${options.protocol}://${options.host}/order/${id}`;

        htmlString = stringInject(htmlString, {
            first_name: EMAIL_ADMIN,
            order_url: orderUrl
        });

        const emailOptions = {
            to: ['leke@techieplanetltd.com', 'sewejeolaleke@gmail.com'],
            subject: EMAIL_NEW_ORDER_SUBJECT,
            //text: 'Hello World',
            html: htmlString,
            email_type: NEW_ORDER_EMAIL
        }

        return emailOptions;

        // this.sendMail(emailOptions)
        //     .then(info => {
        //         this.logEmail(EMAIL_CONFIRM_REG, emailOptions.to, EMAIL_SEND_SUCCESS, EMAIL_SEND_SUCCESS_MESSAGE);
        //     })
        //     .catch(error => {
        //         this.logEmail(
        //             EMAIL_CONFIRM_REG, emailOptions.to, EMAIL_SEND_FAILURE, error.message);
        //     });
        // }
    }

    buildNewOrderEmail(order: Order, options: any): void {
        let status = '';
        let emailData = '';

        this.loadTemplate(EMAIL_NEW_ORDER_TEMPLATE)
            .then(htmlData => {
                status = EMAIL_TEMPLATE_LOADED;
                emailData = this.createEmailData(order, options, htmlData);
            })
            .catch(err => {
                status = EMAIL_TEMPLATE_NOT_LOADED;
            })
            .finally(() => {
                this.logger.writeEmailLog(
                    EMAIL_NEW_ORDER_SUBJECT,
                    status,
                    {order_id: order.id}
                )

                return emailData;
            })
    }
}
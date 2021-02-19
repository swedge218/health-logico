import {Reports} from "./reports";
import {Prescription} from "../../../prescription/domain/prescription.entity";

export class PrescriptionReport extends Reports{
    constructor(){super()}

    getPrescriptionsCount = async(hasFilter:boolean, startDate:Date, endDate:Date):Promise<any> => {
        const sqb = this.connection.getRepository(Prescription)
            .createQueryBuilder('prescriptions');

        if (hasFilter) {
            sqb.where("created_at >= :from", {from: startDate});
            sqb.andWhere("created_at < :to", {to: endDate});
        }
        const a = await sqb.getMany();
        return sqb.getCount().then(cnt => ({name: 'prescriptions', value: cnt}));
    }
}
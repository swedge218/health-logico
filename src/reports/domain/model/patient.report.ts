import {Patient} from "../../../patient/domain/patient.entity";
import {Reports} from "./reports";

export class PatientReport extends Reports{
    constructor(){super()}

    getPatientsCount = async (hasFilter: boolean, startDate: Date, endDate: Date): Promise<any> => {
        const sqb = this.connection.getRepository(Patient)
            .createQueryBuilder('patient');

        if (hasFilter) {
            sqb.where("created_at >= :from", {from: startDate});
            sqb.andWhere("created_at < :to", {to: endDate});
        }
        const a = await sqb.getMany();
        return sqb.getCount().then(cnt => ({name: 'patients', value: cnt}));
    }
}
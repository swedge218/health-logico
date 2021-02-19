import {Hospital} from "./hospital.entity";
import {CreateHospitalDTO} from "./dto/create.hospital.dto";

export class HospitalMapper {
    fromDTO(dto: CreateHospitalDTO):Hospital {
        const hospital: Hospital = new Hospital();

        hospital.title = dto.title;
        hospital.street = dto.street;
        hospital.city = dto.city;
        hospital.state = dto.state;
        hospital.contactName = dto.contactName;
        hospital.contactPhoneNumber = dto.contactPhoneNumber;
        hospital.location = dto.location;

        return hospital;
    }
}
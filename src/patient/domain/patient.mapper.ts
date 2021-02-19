import {Patient} from "./patient.entity";
import {CreatePatientDTO} from "./dto/create-patient.dto";
import {IsDate, IsEmail, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {CancerStage} from "../../cancer-stage/domain/cancer-stage.entity";
import {CancerType} from "../../cancer-type/domain/cancer-type.entity";

export class PatientMapper{
    fromDTO(dto: CreatePatientDTO):Patient {
        const patient: Patient = new Patient();

        patient.dateOfBirth = dto.dateOfBirth;
        patient.nhisInsuranceId = dto.nhisInsuranceId;
        patient.street = dto.street;
        patient.city = dto.city;
        patient.state = dto.state;
        patient.email = dto.email;
        patient.dateOfEnrolment = dto.dateOfEnrolment;
        patient.emergencyAddress = dto.emergencyAddress;
        patient.emergencyPhone = dto.emergencyPhone;
        patient.emergencyPerson = dto.emergencyPerson;
        patient.gender = dto.gender;
        patient.maritalStatus = dto.maritalStatus;
        patient.firstName = dto.firstName;
        patient.middleName = dto.middleName;
        patient.lastName = dto.lastName;
        patient.phoneNumber = dto.phoneNumber;
        patient.cancerStage = dto.cancerStage;
        patient.cancerType = dto.cancerType;
        patient.location = dto.location;

        return patient;
    }
}
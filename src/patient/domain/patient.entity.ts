import {Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {CancerStage} from "../../cancer-stage/domain/cancer-stage.entity";
import {CancerType} from "../../cancer-type/domain/cancer-type.entity";
import {Location} from "../../location/domain/location.entity";
import {BaseEntity} from "../../app.baseentity";

@Entity()
export class Patient extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    // @PrimaryGeneratedColumn("uuid")
    // uuid: string;

    @Column({ nullable: false, name: 'dob' })
    dateOfBirth:string;

    @Column({ name: 'nhisinsuranceid' })
    nhisInsuranceId:string;

    @Column()
    street:string;

    @Column()
    city:string;

    @Column()
    state:string;

    @Column({ unique: true })
    email:string;

    @Column({ name: 'date_of_enrolment' })
    dateOfEnrolment:string;

    @Column({ name: 'emergency_contact_person' })
    emergencyPerson:string;

    @Column({ name: 'emergency_contact_address' })
    emergencyAddress:string;

    @Column({ name: 'emergency_contact_phone' })
    emergencyPhone:string;

    @Column()
    gender:string;

    @Column({ name: 'marital_status' })
    maritalStatus:string;

    @Column({ name: 'first_name' })
    firstName:string;

    @Column({ name: 'middle_name' })
    middleName:string;

    @Column({ name: 'last_name' })
    lastName:string;

    @Column({ name: 'phone_number' })
    phoneNumber:string;

    @ManyToOne(type => CancerStage, { eager: true })
    @JoinColumn({ name: "cancer_stage_id", referencedColumnName: 'id' })
    cancerStage: CancerStage;

    @ManyToOne(type => CancerType, { eager: true })
    @JoinColumn({ name: "cancer_type_id", referencedColumnName: 'id' })
    cancerType: CancerType;

    @ManyToOne(type => Location, { eager: true })
    @JoinColumn({ name: "location_id", referencedColumnName: 'id' })
    location: Location;

}
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../app.baseentity";
import {Patient} from "../../patient/domain/patient.entity";
import {PrescriptionItem} from "../../prescription-item/domain/prescription-item.entity";

@Entity()
export class Prescription extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // title: string;

    @Column()
    active: number;

    @ManyToOne(type => Patient, { eager: true })
    @JoinColumn({ name: "patient_id", referencedColumnName: 'id' })
    patient: Patient;

    @OneToMany(type => PrescriptionItem, prescriptionItem => prescriptionItem.prescription)
    prescriptionItems: PrescriptionItem[];
}
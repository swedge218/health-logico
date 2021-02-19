import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../app.baseentity";

@Entity()
export class Manufacturer extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
}
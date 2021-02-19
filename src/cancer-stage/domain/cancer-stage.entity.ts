import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../app.baseentity";

@Entity()
export class CancerStage extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: false })
    title:string;

    @Column()
    description:string;
}
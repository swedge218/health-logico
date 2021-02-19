import {Column, PrimaryGeneratedColumn, Entity} from "typeorm";
import {BaseEntity} from "../../app.baseentity";

@Entity()
export class Client extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    name:string;

    @Column({ nullable: false })
    email:string;

    @Column({ length: 40, nullable: false, select: false })
    secret:string;

    @Column({ default: 1 })
    active: number;
}


import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Role } from "../../role/domain/role.entity";
import {Location} from "../../location/domain/location.entity";
import {UserBaseEntity} from "./user.base.entity";

@Entity()
export class User extends UserBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    email_address:string;

    @Column({ select: false })
    password:string;

    @Column()
    supervisor:number;

    @ManyToOne(type => Location, { eager: true })
    @JoinColumn({ name: "location_id", referencedColumnName: 'id'})
    location: Location;

    @Column()
    first_name:string;

    @Column()
    last_name:string;

    @Column()
    phone_number: string;

    @Column({ comment: "0-disabled, 1 - active", default: 1 })
    active: number

    @ManyToOne(type => Role, { eager: true })
    @JoinColumn({ name: "role_id", referencedColumnName: 'id'})
    role: Role;
}
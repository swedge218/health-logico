 import {Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import {User} from "../../user/domain/user.entity";
import {BaseEntity} from "../../app.baseentity";
import {Permission} from "../../permission/domain/permission.entity";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    level: number

    @OneToMany(type => User, user => user.role)
    users: User[];

    @ManyToMany(() => Permission)
    @JoinTable()
    acls: Permission[];
}
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../app.baseentity";

@Entity()
export class NotificationType extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    alias: string;

    @Column()
    category: string;
}
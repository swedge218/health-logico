import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../app.baseentity";
import {Role} from "../../role/domain/role.entity";
import {NotificationType} from "../../notification-type/domain/notification-type.entity";

@Entity()
export class NotificationSubs extends BaseEntity{
    // @PrimaryGeneratedColumn()
    // id: number;

    @ManyToOne(type => Role, { eager: true })
    @JoinColumn({ name: "role_id", referencedColumnName: 'id' })
    role: Role;

    @ManyToOne(type => NotificationType, { eager: true })
    @JoinColumn({ name: "notification_type_id", referencedColumnName: 'id' })
    notificationType: NotificationType;
}
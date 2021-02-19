import {
    Column,
    PrimaryGeneratedColumn,
    Entity,
    CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn
} from "typeorm";

@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'action_url', type: "text", nullable: false })
    actionUrl: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ nullable: false })
    title: string;

    @Column({ type:"tinyint", nullable: false })
    viewed: number;

    @Column({ name: 'notification_type', nullable: false })
    notifcationType: string;

    @Column({ name: 'remote_id', type:"int", nullable: false })
    remoteId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdDate: Date;

    @UpdateDateColumn({ name: 'modified_at' })
    modifiedDate: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedDate: Date;
}
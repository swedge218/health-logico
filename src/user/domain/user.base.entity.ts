import {
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    VersionColumn} from 'typeorm';

@Entity()
export class UserBaseEntity {
    @CreateDateColumn({ name: 'created_at' })
    createdDate: Date;

    @UpdateDateColumn({ name: 'modified_at' })
    modifiedDate: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedDate: Date;

    @VersionColumn()
    version: number;
}
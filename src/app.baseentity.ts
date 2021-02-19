import {
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    VersionColumn,
    JoinColumn,
    ManyToOne} from 'typeorm';

@Entity()
export class BaseEntity {
    @CreateDateColumn({ name: 'created_at' })
    createdDate: Date;

    // @ManyToOne(type => User, { eager: true })
    // @JoinColumn({ name: "created_by", referencedColumnName: 'id'})
    // createdBy: User;
    createdBy: number;

    @UpdateDateColumn({ name: 'modified_at' })
    modifiedDate: Date;

    // @ManyToOne(type => User, { eager: true })
    // @JoinColumn({ name: "modified_by", referencedColumnName: 'id'})
    // modifiedBy: User;
    modifiedBy: number;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedDate: Date;

    @VersionColumn()
    version: number;
}
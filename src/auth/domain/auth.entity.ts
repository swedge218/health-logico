import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id:number;

    @Column()
    refresh_token:string;

    @Column()
    token_valid:number;
}
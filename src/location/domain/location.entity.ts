import {PrimaryGeneratedColumn, Column, Entity} from "typeorm";

@Entity({name: "location", synchronize: false,})
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'location_name' })
    locationName: string;

    @Column({ name: 'parent_id' })
    parentId: number;

    @Column()
    tier: number;

    @Column({ name: 'geozone_id' })
    geoZoneId: number;

    @Column({ name: 'geozone_name' })
    geozoneName: string;

    @Column({ name: 'state_id' })
    stateId: number;

    @Column({ name: 'state_name' })
    stateName: string;

    @Column({ name: 'lga_id' })
    lgaId: number;

    @Column({ name: 'lga_name' })
    lgaName: string;
}
import {Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import {BaseEntity} from "../../app.baseentity";
import {Location} from "../../location/domain/location.entity";
import {StockReceipt} from "../../stock-receipt/domain/stock-receipt.entity";
import {Invoice} from "../../invoice/domain/invoice.entity";

@Entity()
export class Hospital extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 100, nullable: false })
    title:string;

    @Column({ length: 100, nullable: false })
    street:string;

    @Column({ length: 50, nullable: false })
    city:string;

    @Column({ length: 20, nullable: false })
    state:string;

    @Column({ name: 'contact_name', length: 50, nullable: false })
    contactName:string;

    @Column({ name: 'contact_phone_number', length: 200, nullable: false })
    contactPhoneNumber:string;

    @ManyToOne(type => Location, { eager: true })
    @JoinColumn({ name: "location_id", referencedColumnName: 'id'})
    location: Location;

    @OneToMany(type => StockReceipt, receipt => receipt.hospital)
    receipt: StockReceipt[];

    @OneToMany(type => Invoice, invoice => invoice.hospital)
    invoice: Invoice[];
}
import {Product} from "../../../product/domain/product.entity";
import {User} from "../../../user/domain/user.entity";
import {IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Column, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {Hospital} from "../../../hospital/domain/hospital.entity";
import {Payment} from "../../../payment/domain/payment.entity";

export class CreateInvoiceDTO {

    @ManyToOne(type => Hospital, { eager: true })
    @JoinColumn({ name: "hospital_id", referencedColumnName: 'id'})
    hospital: Hospital;

    @IsNotEmpty()
    @IsNumber()
    saleOfficer: User;

    @IsNotEmpty()
    @IsArray()
    items: JSON[];
}
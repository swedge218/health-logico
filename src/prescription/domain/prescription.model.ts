import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, getConnection, SelectQueryBuilder} from 'typeorm';
import {DeleteResult, Repository} from "typeorm";
import {Prescription} from "./prescription.entity";
import {CreatePrescriptionDTO} from "./dto/create-precription.dto";
import {PrescriptionMapper} from "./prescription.mapper";
import {PrescriptionItemModel} from "../../prescription-item/domain/prescription-item.model";
import {PrescriptionItem} from "../../prescription-item/domain/prescription-item.entity";
import {PrescriptionItemMapper} from "../../prescription-item/domain/prescription-item.mapper";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class PrescriptionModel extends BaseModel{
    constructor(
        @InjectRepository(Prescription)
        private readonly repository: Repository<Prescription>,
        private prescriptionItemModel: PrescriptionItemModel,
        private connection: Connection = getConnection()
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<Prescription>> {
        return this.repository
            .createQueryBuilder('prescription')
            .leftJoinAndSelect("prescription.patient", "patient")
            .leftJoinAndSelect("prescription.prescriptionItems", "prescriptionItem")
            .leftJoinAndSelect("prescriptionItem.product", "product")
    }

    async findAll(options: any={}): Promise<any> {
        const {page, limit} = this.makeFindAllOptions(options);
        options = {...options, page, limit};
        const offset = page * limit;
        const count = await this.repository.count();
        const SQB = await this.findTemplate();

        return SQB
            .skip(offset)
            .take(limit)
            .getMany()
            .then(items => {
                return PrescriptionModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<Prescription> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findRelatedData(id: number): Promise<Prescription> {

        const prescriptions: Prescription[] = await this.repository.find({
            join: {
                alias: 'presc',
                innerJoinAndSelect: {
                    prescriptionItem: "presc.prescriptionItems",
                    product: "prescriptionItem.product"
                },
            },
            where: {id: id},
        });

        return prescriptions[0];
    }

    async save(createPrescriptionDTO: CreatePrescriptionDTO): Promise<Prescription> {
        const prescription: Prescription = new PrescriptionMapper().fromDTO(createPrescriptionDTO);
        return this.repository.save(prescription)
            .then(prescription => prescription)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }


    async saveTransaction(createPrescriptionDTO: CreatePrescriptionDTO): Promise<any> {
        const prescription: Prescription = new PrescriptionMapper().fromDTO(createPrescriptionDTO);

        const itemsList: JSON[] = createPrescriptionDTO.items;

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{

            return queryRunner.manager.save(prescription)
                .then(async prescription => {
                    return prescription;

                })
                .then(prescription => {

                    return Promise.all(
                        itemsList.map(async (item) => {
                            const product = item['product'];
                            const dosage = item['dosage'];
                            const prescItemDTO = await this.prescriptionItemModel.setUpPrescriptionItemDTO(
                                prescription, product, dosage
                            );
                            let mappedPrescItem: PrescriptionItem = new PrescriptionItemMapper().fromDTO(prescItemDTO);
                            let prescItem = queryRunner.manager.save(mappedPrescItem);
                            return prescItem;
                        })
                    )

                }).then(async prescItemsList => {
                    await queryRunner.commitTransaction();
                    const prescId = prescItemsList[0].prescription.id;
                    return this.findRelatedData(prescId);
                })

        }catch(err)  {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        }
    }

    // async update(id: number, createPrescriptionDTO: CreatePrescriptionDTO): Promise<Prescription> {
    //     const prescription: Prescription = new PrescriptionMapper().fromDTO(createPrescriptionDTO);
    //     return this.repository.update(id,  prescription)
    //         .then(() => { return this.findOne(id) })
    //         .catch((e) => {
    //             throw new InternalServerErrorException(e)
    //         })
    // }


    async updateTransaction(id: number, createPrescriptionDTO: CreatePrescriptionDTO): Promise<any> {
        const prescription: Prescription = new PrescriptionMapper().fromDTO(createPrescriptionDTO);

        const itemsList: JSON[] = createPrescriptionDTO.items;

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{

            return queryRunner.manager.update(Prescription, id, prescription)
                .then(async p => {
                     return this.findOne(id);
                }).then(async presc => {
                    return this.prescriptionItemModel.removeByPrescription(presc.id, queryRunner)
                        .then(() => presc);
                })
                .then(presc => {
                    return Promise.all(
                        itemsList.map(async (item) => {
                            const product = item['product'];
                            const dosage = item['dosage'];
                            const prescItemDTO = await this.prescriptionItemModel.setUpPrescriptionItemDTO(
                                presc, product, dosage
                            );
                            let mappedPrescItem: PrescriptionItem = new PrescriptionItemMapper().fromDTO(prescItemDTO);
                            let prescItem = queryRunner.manager.save(mappedPrescItem);
                            return prescItem;
                        })
                    )

                }).then(async prescItemsList => {
                    await queryRunner.commitTransaction();
                    const prescId = prescItemsList[0].prescription.id;
                    return this.findRelatedData(prescId);
                })

        }catch(err)  {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        }
    }



    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
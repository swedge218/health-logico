import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, QueryRunner, Repository, SelectQueryBuilder} from "typeorm";
import {PrescriptionItem} from "./prescription-item.entity";
import {CreatePrescriptionItemDTO} from "./dto/create-prescription-item.dto";
import {PrescriptionItemMapper} from "./prescription-item.mapper";
import {UpdatePrescriptionItemDTO} from "./dto/update-prescription-item.dto";
import {Product} from "../../product/domain/product.entity";
import {Prescription} from "../../prescription/domain/prescription.entity";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class PrescriptionItemModel extends BaseModel{
    constructor(
        @InjectRepository(PrescriptionItem)
        private readonly repository: Repository<PrescriptionItem>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<PrescriptionItem>> {
        return this.repository
            .createQueryBuilder('prescriptionItem')
            .leftJoinAndSelect("prescriptionItem.product", "product")
            .leftJoinAndSelect("prescriptionItem.prescription", "prescription");
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
                return PrescriptionItemModel.makePainationData(items, options, count);
            });
    }


    async findOne(id: number): Promise<PrescriptionItem> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findByPrescriptionId(prescId: number): Promise<PrescriptionItem[]> {
        return this.repository.find({ where: {prescription: prescId}});
    }

    // async save(createPrescriptionItemDTO: CreatePrescriptionItemDTO): Promise<PrescriptionItem[]> {
    //     const productArray = createPrescriptionItemDTO.products;
    //     const prescription = createPrescriptionItemDTO.prescription;
    //
    //     for(const product of productArray) {
    //         const itemDTO = {prescription, product};
    //         const prescriptionItem: PrescriptionItem = new PrescriptionItemMapper().fromDTO(itemDTO);
    //
    //         await this.repository.save(prescriptionItem)
    //             .then(prescriptionItem => prescriptionItem)
    //             .catch((e) => {
    //                 throw new InternalServerErrorException(e)
    //             })
    //     }
    //
    //     return this.findByPrescriptionId(Number(prescription))
    // }

    async save(createPrescriptionItemDTO: CreatePrescriptionItemDTO): Promise<PrescriptionItem> {
        const prescriptionItem: PrescriptionItem = new PrescriptionItemMapper().fromDTO(createPrescriptionItemDTO);
        return await this.repository.save(prescriptionItem)
            .then(prescriptionItem => prescriptionItem)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, updatePrescriptionItemDTO: UpdatePrescriptionItemDTO): Promise<PrescriptionItem> {
        const prescriptionItem: PrescriptionItem = new PrescriptionItemMapper().fromDTO(updatePrescriptionItemDTO);
        return this.repository.update(id,  prescriptionItem)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }

    async removeByPrescription(prescId: number, queryRunner?: QueryRunner): Promise<any> {
        return this.repository.createQueryBuilder('prescItem')
            .where("prescription_id = :prescId", {prescId: prescId})
            .getMany()
            .then( items => {
                if(queryRunner) { //when using this method in a transaction
                    return queryRunner.manager.remove(items);
                } else {
                    return this.repository.remove(items);
                }
            })

    }


    async setUpPrescriptionItemDTO(prescription: Prescription,
                                   product: Product, dosage: string): Promise<CreatePrescriptionItemDTO> {

        return new PrescriptionItemMapper().toDTO(prescription, product, dosage);
    }
}
import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {ProcurementItem} from "./procurement-item.entity";
import {CreateProcurementItemDTO} from "./dto/create-procurement-item.dto";
import {ProcurementItemMapper} from "./procurement-item.mapper";
import {Product} from "../../product/domain/product.entity";
import {Procurement} from "../../procurement/domain/procurement.entity";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class ProcurementItemModel extends BaseModel{
    constructor(
        @InjectRepository(ProcurementItem)
        private readonly repository: Repository<ProcurementItem>
    ) {
        super()
    }

    async findTemplate() {
        return this.repository
            .createQueryBuilder('procItem')
            .leftJoinAndSelect("procItem.product", "product")
            .leftJoinAndSelect("procItem.procurement", "procurement");
    }

    async findAll(options: any): Promise<any> {
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
                return ProcurementItemModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<ProcurementItem> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findOneByProductId(productId: number): Promise<ProcurementItem> {
        return this.findTemplate().then(sqb => {
                return sqb
                    .orderBy("procItem.id", "ASC")
                    .where({product: productId})
                    .getOne()
            });
    }


    // extractHospitalFromReceiptItemData(data: any) {
    //     return data.hospital;
    // }

    async save(createProcurementItemDTO: CreateProcurementItemDTO): Promise<ProcurementItem> {
        const procurementItem: ProcurementItem = new ProcurementItemMapper().fromDTO(createProcurementItemDTO);
        return this.repository.save(procurementItem)
            .then(procurementItem => { return this.findOne(procurementItem.id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createProcurementItemDTO: CreateProcurementItemDTO): Promise<ProcurementItem> {
        const procurementItem: ProcurementItem = new ProcurementItemMapper().fromDTO(createProcurementItemDTO);
        return this.repository.update(id,  procurementItem)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }

    async setUpProcurementItemDTO(procurement: Procurement, product: Product,
                            quantityReceived: number, batchNumber: string,
                            expiryDate: string): Promise<CreateProcurementItemDTO> {

        return new ProcurementItemMapper().toDTO(
            procurement, product, quantityReceived,
            batchNumber, expiryDate);
    }
}
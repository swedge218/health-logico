import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, DeleteResult, getConnection, Repository, SelectQueryBuilder} from "typeorm";
import {Procurement} from "./procurement.entity";
import {CreateProcurementDTO} from "./dto/create-procurement.dto";
import {ProcurementMapper} from "./procurement.mapper";
import {CreateProcurementItemDTO} from "../../procurement-item/domain/dto/create-procurement-item.dto";
import {ProcurementItemModel} from "../../procurement-item/domain/procurement-item.model";
import {ProcurementItemMapper} from "../../procurement-item/domain/procurement-item.mapper";
import {ProcurementItem} from "../../procurement-item/domain/procurement-item.entity";
import {BaseModel} from "../../app.basemodel";
import {NEW_PROCUREMENT_REMARK} from "../../procurement-item/domain/constants/procurement-item.constants";
import {AdjustmentModel} from "../../adjustment/domain/adjustment.model";
import {AdjustmentActionEnums} from "../../adjustment/domain/enums/adjustment.type.enums";

@Injectable()
export class ProcurementModel extends BaseModel {
    constructor(
        @InjectRepository(Procurement)
        private readonly repository: Repository<Procurement>,
        private procurementItemModel: ProcurementItemModel,
        private adjustmentModel: AdjustmentModel,
        private connection: Connection = getConnection()
    ) {
        super()
    }

    async findTemplate(): Promise<SelectQueryBuilder<Procurement>> {
        return this.repository
            .createQueryBuilder('proc')
            .leftJoinAndSelect("proc.deliveryStatus", "deliveryStatus")
            .leftJoinAndSelect("proc.processingOfficer", "processingOfficer")
            .leftJoinAndSelect("proc.procurementItems", "procurementItem")
            .leftJoinAndSelect("procurementItem.product", "product")
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
                return ProcurementModel.makePainationData(
                    items, options, count);
            });
    }


    async findOne(id: number): Promise<Procurement> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async findRelatedData(id: number): Promise<Procurement> {
        const procurements: Procurement[] = await this.repository.find({
            join: {
                alias: 'proc',
                innerJoinAndSelect: {
                    procurementItem: "proc.procurementItems",
                    product: "procurementItem.product"
                },
            },
            where: {id: id},
        });

        return procurements[0];
    }

    async save(createProcurementDTO: CreateProcurementDTO): Promise<Procurement> {
        const procurement: Procurement = new ProcurementMapper().fromDTO(createProcurementDTO);
        return this.repository.save(procurement)
            .then(procurement => procurement)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async saveTransaction(createProcurementDTO: CreateProcurementDTO): Promise<any> {
        let procurement: Procurement = new ProcurementMapper().fromDTO(createProcurementDTO);

        const itemsList: JSON[] = createProcurementDTO.items;

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{

            return queryRunner.manager.save(procurement)
                .then(async p => {
                    procurement = p;
                    return procurement;

                }).then(procurement => {
                    const procItemDTOList: CreateProcurementItemDTO[] = [];

                    itemsList.map(async (item) => {
                        const procItemDTO = await this.procurementItemModel.setUpProcurementItemDTO(
                            procurement,
                            item['product'], item['quantity'],
                            item['batchNumber'], item['expiryDate'])
                        procItemDTOList.push(procItemDTO)
                    })

                    return procItemDTOList;

                }).then(async (procItemDTOList) => {
                    return Promise.all(
                        procItemDTOList.map( async (item) => {
                            let mappedProcItem: ProcurementItem = new ProcurementItemMapper().fromDTO(item);
                            let procItem = queryRunner.manager.save(mappedProcItem);
                            return procItem;
                        })
                    )
                }).then(procItemList => {
                    return Promise.all(
                        procItemList.map( async (item) => {
                            this.adjustmentModel.upAdjustment(
                                item.product,
                                item.quantityReceived,
                                item.batchNumber,
                                AdjustmentActionEnums.PROCUREMENT,
                                NEW_PROCUREMENT_REMARK);
                        })
                    )
                })
                .then(async procItemsList => {
                    await queryRunner.commitTransaction();
                    return this.findRelatedData(procurement.id);
                })

        }catch(err)  {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        }
    }

    async update(id: number, createProcurementDTO: CreateProcurementDTO): Promise<Procurement> {
        const procurement: Procurement = new ProcurementMapper().fromDTO(createProcurementDTO);
        return this.repository.update(id,  procurement)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
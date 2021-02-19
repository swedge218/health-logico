import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, SelectQueryBuilder} from "typeorm";
import {DeliveryStatus} from "./delivery-status.entity";
import {CreateDeliveryStatusDTO} from "./dto/create-delivery-status.dto";
import {DeliveryStatusMapper} from "./dto/delivery-status.mapper";
import {BaseModel} from "../../app.basemodel";

@Injectable()
export class DeliveryStatusModel extends BaseModel{
    constructor(
        @InjectRepository(DeliveryStatus)
        private readonly repository: Repository<DeliveryStatus>
    ) {
        super();
    }

    async findTemplate(): Promise<SelectQueryBuilder<DeliveryStatus>> {
        return this.repository.createQueryBuilder('cancertype');
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
                return DeliveryStatusModel.makePainationData(items, options, count);
            });
    }

    async findOne(id: number): Promise<DeliveryStatus> {
        return this.findTemplate().then(sqb => sqb.where({id: id}).getOne());
    }

    async save(createDeliveryStatusDTO: CreateDeliveryStatusDTO): Promise<DeliveryStatus> {
        const deliveryStatus: DeliveryStatus = new DeliveryStatusMapper().fromDTO(createDeliveryStatusDTO);
        return this.repository.save(deliveryStatus)
            .then(deliveryStatus => deliveryStatus)
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async update(id: number, createDeliveryStatusDTO: CreateDeliveryStatusDTO): Promise<DeliveryStatus> {
        const deliveryStatus: DeliveryStatus = new DeliveryStatusMapper().fromDTO(createDeliveryStatusDTO);
        return this.repository.update(id,  deliveryStatus)
            .then(() => { return this.findOne(id) })
            .catch((e) => {
                throw new InternalServerErrorException(e)
            })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.repository.softDelete(id);
    }
}
import {ForbiddenException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {Connection, getConnection} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {StockIssue} from "./stock-issue.entity";
import {CreateEmergencyStockIssueDTO} from "./dto/create-issue-emergency.dto";
import {OrderModel} from "../../order/domain/order.model";
import {StockIssueModel} from "./stock-issue.model";

@Injectable()
export class EmergencyStockIssueModel{
    constructor(
        @InjectRepository(StockIssue)
        private readonly repository: Repository<StockIssue>,

        private orderModel: OrderModel,
        private stockIssueModel: StockIssueModel,
        private connection: Connection = getConnection()

    ) {}

    async findAll(): Promise<StockIssue[]> {
        return this.repository.find();
    }

    async findOne(id: number): Promise<StockIssue> {
        return this.repository.findOne(id);
    }


    async saveTransaction(emergencyIssueDTO: CreateEmergencyStockIssueDTO): Promise<StockIssue> {

        // const queryRunner = this.connection.createQueryRunner();
        // await queryRunner.connect();
        // await queryRunner.startTransaction();
        //
        try {
            return await this.orderModel.saveUpEmergencyOrder(
                emergencyIssueDTO.hospital,
                emergencyIssueDTO.issuingOfficer,
                emergencyIssueDTO.items
            ).then(async (order) => {
                return await this.stockIssueModel.saveEmergencyIssue(
                    order,
                    emergencyIssueDTO.items,
                    emergencyIssueDTO.issueDate)
            })
        } catch(err)  {
            // await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        }
    }
}
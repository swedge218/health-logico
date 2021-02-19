import { Injectable } from '@nestjs/common';
import {StockIssue} from "./domain/stock-issue.entity";
import {CreateStockIssueDTO} from "./domain/dto/create-stock-issue.dto";
import {StockIssueModel} from "../stock-issue/domain/stock-issue.model";
import {CreateEmergencyStockIssueDTO} from "./domain/dto/create-issue-emergency.dto";
import {EmergencyStockIssueModel} from "./domain/stock-issue-emergency.model";

@Injectable()
export class StockIssueService {
    constructor(
        private stockIssueModel: StockIssueModel,
        private emergencyIssueModel: EmergencyStockIssueModel,
    ) {}

    async findAll(options: any): Promise<any[]> {
        return this.stockIssueModel.findAll(options);
    }

    async findOne(id: number): Promise<StockIssue> {
        return this.stockIssueModel.findOne(id);
    }

    async findHospitalIssues(hospitalId: number): Promise<any[]> {
        return await this.stockIssueModel.findHospitalIssues(hospitalId);
    }

    async findIssueTypes(): Promise<any> {
        return this.stockIssueModel.findIssueTypes();
    }

    async create(createStockIssueDTO: CreateStockIssueDTO): Promise<StockIssue> {
        return this.stockIssueModel.saveTransaction(createStockIssueDTO);
    }

    async createEmergency(emergencyIssueDTO: CreateEmergencyStockIssueDTO): Promise<StockIssue> {
        return this.emergencyIssueModel.saveTransaction(emergencyIssueDTO);
    }

    async update(id: number, createStockIssueDTO: CreateStockIssueDTO): Promise<StockIssue> {
        return this.stockIssueModel.update(id,  createStockIssueDTO);
    }

    async remove(id: number): Promise<any> {
        return this.stockIssueModel.remove(id);
    }
}

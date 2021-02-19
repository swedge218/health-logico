import {StockIssue} from "./stock-issue.entity";
import {CreateStockIssueDTO} from "./dto/create-stock-issue.dto";
import {Hospital} from "../../hospital/domain/hospital.entity";
import {User} from "../../user/domain/user.entity";
import {OrderStatus} from "../../order-status/domain/order-status.entity";
import {Order} from "../../order/domain/order.entity";

export class StockIssueMapper{
    fromDTO(dto: CreateStockIssueDTO):StockIssue {
        const stockIssue: StockIssue = new StockIssue();

        stockIssue.order = dto.order;
        stockIssue.issuingOfficer = dto.issuingOfficer;
        stockIssue.issueDate = dto.issueDate;
        stockIssue.issueType = dto.issueType;

        return stockIssue;
    }

    toDTO(order: Order, processingOfficer: User,
          issueType: number, issueDate: string): CreateStockIssueDTO{

        const dto: CreateStockIssueDTO = new CreateStockIssueDTO();

        dto.order = order;
        dto.issuingOfficer = processingOfficer;
        dto.issueType = issueType;
        dto.issueDate = issueDate;

        return dto;
    }
}
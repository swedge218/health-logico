import {StockIssueItem} from "./stock-issue-item.entity";
import {CreateStockIssueItemDTO} from "./dto/create-stock-issue-item.dto";
import {StockIssue} from "../../stock-issue/domain/stock-issue.entity";
import {OrderItem} from "../../order-item/domain/order-item.entity";

export class StockIssueItemMapper{
    fromDTO(dto: CreateStockIssueItemDTO):StockIssueItem {
        const stockIssueItem: StockIssueItem = new StockIssueItem();

        stockIssueItem.orderItem = dto.orderItem;
        stockIssueItem.stockIssue = dto.stockIssue;
        stockIssueItem.quantityIssued = dto.quantityIssued;
        stockIssueItem.batchNumber = dto.batchNumber;

        return stockIssueItem;
    }

    toDTO(issue: StockIssue, orderItem: OrderItem,
          quantityIssued: number, batchNumber: string):CreateStockIssueItemDTO {
        const dto: CreateStockIssueItemDTO = new CreateStockIssueItemDTO();

        dto.orderItem = orderItem;
        dto.stockIssue = issue;
        dto.quantityIssued = quantityIssued;
        dto.batchNumber = batchNumber;

        return dto;
    }
}
import {StockReceipt} from "./stock-receipt.entity";
import {CreateStockReceiptDTO} from "./dto/create-stock-receipt.dto";
import {StockIssueItem} from "../../stock-issue-item/domain/stock-issue-item.entity";

export class StockReceiptMapper{
    fromDTO(dto: CreateStockReceiptDTO):StockReceipt {
        const stockReceipt: StockReceipt = new StockReceipt();

        stockReceipt.receiptDate = dto.receiptDate;
        stockReceipt.stockIssue = dto.stockIssue;
        stockReceipt.hospital = dto.hospital;
        stockReceipt.receiptType = dto.receiptType;

        return stockReceipt;
    }
}
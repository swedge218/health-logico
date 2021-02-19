import {StockReceiptItem} from "./stock-receipt-item.entity";
import {CreateStockReceiptItemDTO} from "./dto/create-stock-receipt-item.dto";
import {StockReceipt} from "../../stock-receipt/domain/stock-receipt.entity";
import {StockIssueItem} from "../../stock-issue-item/domain/stock-issue-item.entity";

export class StockReceiptItemMapper{
    fromDTO(dto: CreateStockReceiptItemDTO):StockReceiptItem {
        const stockReceiptItem: StockReceiptItem = new StockReceiptItem();

        stockReceiptItem.quantityReceived = dto.quantityReceived;
        stockReceiptItem.batchNumber = dto.batchNumber;
        stockReceiptItem.stockReceipt = dto.stockReceipt;
        stockReceiptItem.issueItem = dto.stockIssueItem;
        // stockReceiptItem.hospital = dto.hospital;

        return stockReceiptItem;
    }

    toDTO(receipt: StockReceipt, issueItem: StockIssueItem,
          quantity: number, batchNumber: string): CreateStockReceiptItemDTO {
        const dto: CreateStockReceiptItemDTO = new CreateStockReceiptItemDTO();

        dto.stockReceipt = receipt;
        dto.stockIssueItem = issueItem;
        dto.quantityReceived = quantity;
        dto.batchNumber = batchNumber;

        return dto;
    }
}
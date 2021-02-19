import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {StockIssueItem} from "../../../stock-issue-item/domain/stock-issue-item.entity";
import {StockReceipt} from "../../../stock-receipt/domain/stock-receipt.entity";

export class CreateStockReceiptItemDTO {

    @IsNotEmpty()
    @IsNumber()
    quantityReceived: number;

    @IsNotEmpty()
    @IsString()
    batchNumber: string;

    @IsNotEmpty()
    @IsNumber()
    stockIssueItem: StockIssueItem;

    @IsNotEmpty()
    @IsNumber()
    stockReceipt: StockReceipt;
}
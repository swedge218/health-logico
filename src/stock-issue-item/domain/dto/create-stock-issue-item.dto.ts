import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {OrderItem} from "../../../order-item/domain/order-item.entity";
import {StockIssue} from "../../../stock-issue/domain/stock-issue.entity";

export class CreateStockIssueItemDTO {
    @IsNotEmpty()
    @IsNumber()
    quantityIssued: number;

    @IsNotEmpty()
    @IsString()
    batchNumber: string;

    @IsNotEmpty()
    @IsNumber()
    orderItem: OrderItem;

    @IsNotEmpty()
    @IsNumber()
    stockIssue: StockIssue;
}
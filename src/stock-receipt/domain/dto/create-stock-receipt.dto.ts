import {Hospital} from "../../../hospital/domain/hospital.entity";
import {IsArray, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {StockIssue} from "../../../stock-issue/domain/stock-issue.entity";

export class CreateStockReceiptDTO {
    @IsNotEmpty()
    @IsString()
    receiptDate: string;

    @IsNotEmpty()
    @IsNumber()
    stockIssue: StockIssue;

    @IsNotEmpty()
    @IsNumber()
    hospital: Hospital;

    @IsNotEmpty()
    @IsNumber()
    receiptType: number;

    @IsNotEmpty()
    @IsArray()
    items: JSON[]; //"items": [{"issueItem": 3, "quantityIssued": 1}]
}
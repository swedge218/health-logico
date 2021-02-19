import {Stock} from "./stock.entity";
import {CreateStockDTO} from "./dto/create-stock.dto";
import {Adjustment} from "../../adjustment/domain/adjustment.entity";

export class StockMapper{
    fromDTO(dto: CreateStockDTO):Stock {
        const stock: Stock = new Stock();

        stock.product = dto.product;
        stock.quantity = dto.quantity;
        stock.batchNumber = dto.batchNumber;
        stock.hospital = dto.hospital;

        return stock;
    }

    fromAdjustment(adjustment:Adjustment): CreateStockDTO {
        const createStockDTO: CreateStockDTO = new CreateStockDTO();
        createStockDTO.product = adjustment.product;
        createStockDTO.quantity = adjustment.quantity;
        createStockDTO.hospital = adjustment.hospital;
        createStockDTO.batchNumber = adjustment.batchNumber;

        return createStockDTO;
    }
}
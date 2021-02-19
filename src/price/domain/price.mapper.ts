import {Price} from "./price.entity";
import {CreatePriceDTO} from "./dto/create-price.dto";
import {DEFAULT_UNIT_COST} from "./constants/price.constants";
import {Stock} from "../../stock/domain/stock.entity";
import {STOCK_START_BATCH} from "../../stock/domain/constants/stock.constants";

export class PriceMapper{
    fromDTO(dto: CreatePriceDTO):Price {
        const price: Price = new Price();

        price.batchNumber = dto.batchNumber;
        price.unitCost = dto.unitCost;
        price.product = dto.product;
        // price.stock = dto.stock;

        return price;
    }

    toDTO(stock: Stock): CreatePriceDTO {
        const dto: CreatePriceDTO = new CreatePriceDTO();

        dto.batchNumber = stock.batchNumber;
        dto.unitCost = DEFAULT_UNIT_COST;
        dto.product = stock.product;
        // dto.stock = stock;

        return dto;
    }
}
import {Product} from "./product.entity";
import {CreateProductDTO} from "./dto/create.product.dto";

export class ProductMapper {
    fromDTO(dto: CreateProductDTO):Product {
        const product: Product = new Product();

        product.brandName = dto.brandName;
        product.formulation = dto.formulation;
        product.genericName = dto.genericName;
        product.strength = dto.strength;
        product.thresholdValue = dto.thresholdValue;
        // product.unitCost = dto.unitCost;
        product.manufacturer = dto.manufacturer;

        return product;
    }
}
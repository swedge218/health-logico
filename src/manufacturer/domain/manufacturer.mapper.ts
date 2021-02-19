import {CreateManufacturerDTO} from "./dto/create.manufacturer.dto";
import {Manufacturer} from "./manufacturer.entity";

export class ManufacturerMapper {
    fromDTO(createManufacturerDTO: CreateManufacturerDTO): Manufacturer {
        const manufacturer: Manufacturer = new Manufacturer();
        manufacturer.title = createManufacturerDTO.title;
        return manufacturer;
    }
}
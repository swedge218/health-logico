import {CancerType} from "./cancer-type.entity";
import {CreateCancerTypeDTO} from "./dto/create-cancer-type.dto";

export class CancerTypeMapper{
    fromDTO(dto: CreateCancerTypeDTO):CancerType {
        const cancerType: CancerType = new CancerType();

        cancerType.title = dto.title;
        cancerType.description = dto.description;

        return cancerType;
    }
}
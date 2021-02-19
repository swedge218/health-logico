import {CancerStage} from "./cancer-stage.entity";
import {CreateCancerStageDTO} from "./dto/create-cancer-stage.dto";

export class CancerStageMapper{
    fromDTO(dto: CreateCancerStageDTO):CancerStage {
        const cancerStage: CancerStage = new CancerStage();

        cancerStage.title = dto.title;
        cancerStage.description = dto.description;

        return cancerStage;
    }
}
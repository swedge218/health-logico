import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req} from '@nestjs/common';
import {CancerStageService} from "./cancer-stage.service";
import {CreateCancerStageDTO} from "./domain/dto/create-cancer-stage.dto";
import {CancerStage} from "./domain/cancer-stage.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('cancerstages')
export class CancerStageController {
    constructor(private readonly cancerStageService: CancerStageService){}

    @RequiredPermissions(PermissionsEnum.VIEW_CANCER_STAGE)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.cancerStageService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_CANCER_STAGE)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<CancerStage> {
        return this.cancerStageService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.CREATE_CANCER_STAGE)
    @Post()
    async create(@Body() createCancerStageDTO: CreateCancerStageDTO) {
        return this.cancerStageService.create(createCancerStageDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_CANCER_STAGE)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createCancerStageDTO: CreateCancerStageDTO): Promise<CancerStage> {
        return this.cancerStageService.update(id,  createCancerStageDTO);
    }

    @RequiredPermissions(PermissionsEnum.DELETE_CANCER_STAGE)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.cancerStageService.remove(id);
    }
}
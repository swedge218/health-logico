import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, Query} from '@nestjs/common';
import {CancerTypeService} from "./cancer-type.service";
import {CreateCancerTypeDTO} from "./domain/dto/create-cancer-type.dto";
import {CancerType} from "./domain/cancer-type.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";

@Controller('cancertypes')
export class CancerTypeController {
    constructor(private readonly cancerTypeService: CancerTypeService){}


    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.cancerTypeService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<CancerType> {
        return this.cancerTypeService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @Post()
    async create(@Body() createCancerTypeDTO: CreateCancerTypeDTO) {
        return this.cancerTypeService.create(createCancerTypeDTO);
    }

    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createCancerTypeDTO: CreateCancerTypeDTO): Promise<CancerType> {
        return this.cancerTypeService.update(id,  createCancerTypeDTO);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.cancerTypeService.remove(id);
    }
}
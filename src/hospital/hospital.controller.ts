import {Controller, Get, Post, Param, Body, Put, Delete, Req, Query} from '@nestjs/common';
import {ParseIntPipe} from "@nestjs/common";
import { Injectable } from '@nestjs/common';
import {HospitalService} from "./hospital.service";
import {Hospital} from "../hospital/domain/hospital.entity";
import {CreateHospitalDTO} from "./domain/dto/create.hospital.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('hospitals')
@Injectable()
export class HospitalController {
    constructor(private readonly hospitalService: HospitalService){}

    @RequiredPermissions(PermissionsEnum.VIEW_HOSPITAL)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.hospitalService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_HOSPITAL)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Hospital> {
        return this.hospitalService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.CREATE_HOSPITAL)
    @Post()
    async create(@Body() createHospitalDTO: CreateHospitalDTO) {
        return this.hospitalService.create(createHospitalDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_HOSPITAL)
    @Put(':id')
    async update(@Param('id') id: number,
           @Body() createHospitalDTO: CreateHospitalDTO): Promise<Hospital> {
        return this.hospitalService.update(id,  createHospitalDTO);
    }

    @RequiredPermissions(PermissionsEnum.DELETE_HOSPITAL)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.hospitalService.remove(id);
    }
}

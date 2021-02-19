import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req} from '@nestjs/common';
import {PatientService} from "./patient.service";
import {CreatePatientDTO} from "./domain/dto/create-patient.dto";
import {Patient} from "./domain/patient.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('patient')
export class PatientController {
    constructor(private readonly patientService: PatientService){}

    @RequiredPermissions(PermissionsEnum.VIEW_PATIENT)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.patientService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PATIENT)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Patient> {
        return this.patientService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.CREATE_PATIENT)
    @Post()
    async create(@Body() createPatientDTO: CreatePatientDTO) {
        return this.patientService.create(createPatientDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_PATIENT)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createPatientDTO: CreatePatientDTO): Promise<Patient> {
        return this.patientService.update(id,  createPatientDTO);
    }

    @RequiredPermissions(PermissionsEnum.DELETE_PATIENT)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.patientService.remove(id);
    }
}
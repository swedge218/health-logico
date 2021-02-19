import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req} from '@nestjs/common';
import {PrescriptionService} from "../prescription/prescription.service";
import {Prescription} from "../prescription/domain/prescription.entity";
import {CreatePrescriptionDTO} from "./domain/dto/create-precription.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('prescription')
export class PrescriptionController {
    constructor(private readonly prescriptionService: PrescriptionService){}

    @RequiredPermissions(PermissionsEnum.VIEW_PRESCRIPTION)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.prescriptionService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PRESCRIPTION)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Prescription> {
        return this.prescriptionService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.CREATE_PRESCRIPTION)
    @Post()
    async create(@Body() createPrescriptionDTO: CreatePrescriptionDTO) {
        return this.prescriptionService.create(createPrescriptionDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_PRESCRIPTION)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createPrescriptionDTO: CreatePrescriptionDTO): Promise<Prescription> {
        return this.prescriptionService.update(id,  createPrescriptionDTO);
    }

    @RequiredPermissions(PermissionsEnum.DELETE_PRESCRIPTION)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.prescriptionService.remove(id);
    }
}

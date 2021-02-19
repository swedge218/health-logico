import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req} from '@nestjs/common';
import {PrescriptionItemService} from "./prescription-item.service";
import {PrescriptionItem} from "./domain/prescription-item.entity";
import {CreatePrescriptionItemDTO} from "./domain/dto/create-prescription-item.dto";
import {UpdatePrescriptionItemDTO} from "./domain/dto/update-prescription-item.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('prescriptionItem')
export class PrescriptionItemController {
    constructor(private readonly prescriptionItemService: PrescriptionItemService){}

    @RequiredPermissions(PermissionsEnum.VIEW_PRESCRIPTION)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.prescriptionItemService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PRESCRIPTION)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<PrescriptionItem> {
        return this.prescriptionItemService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @Closed()
    @Post()
    async create(@Body() createPrescriptionItemDTO: CreatePrescriptionItemDTO): Promise<PrescriptionItem>{
        return this.prescriptionItemService.create(createPrescriptionItemDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_PRESCRIPTION)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() updatePrescriptionItemDTO: UpdatePrescriptionItemDTO): Promise<PrescriptionItem> {
        return this.prescriptionItemService.update(id,  updatePrescriptionItemDTO);
    }

    @Closed()
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.prescriptionItemService.remove(id);
    }

    @Closed()
    @Delete('/prescription/:id')
    async removeByPrescription(@Param('id') prescId: number): Promise<any> {
        return this.prescriptionItemService.removeByPrescription(prescId);
    }
}
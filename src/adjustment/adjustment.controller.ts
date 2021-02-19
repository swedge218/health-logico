import {Body, Controller, Get, Param, Post, Query, Req} from '@nestjs/common';
import {AdjustmentService} from "./adjustment.service";
import {CreateAdjustmentDTO} from "./domain/dto/create-adjustment.dto";
import {Adjustment} from "./domain/adjustment.entity";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";

@Controller('adjustment')
export class AdjustmentController {
    constructor(private readonly adjustmentService: AdjustmentService){}

    @RequiredPermissions(PermissionsEnum.VIEW_ADJUSTMENT)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.adjustmentService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_ADJUSTMENT)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Adjustment> {
        return this.adjustmentService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @Post('/register-product')
    async registerProduct(@Body() body: any) {
        return this.adjustmentService.registerProduct(body.product);
    }

    @RequiredPermissions(PermissionsEnum.CREATE_ADJUSTMENT)
    @Post()
    async create(@Body() createAdjustmentDTO: CreateAdjustmentDTO) {
        return this.adjustmentService.create(createAdjustmentDTO, false);
    }

    // @Put(':id')
    // async update(@Param('id') id: number,
    //              @Body() createAdjustmentDTO: CreateAdjustmentDTO): Promise<Adjustment> {
    //     return this.adjustmentService.update(id,  createAdjustmentDTO);
    // }

    // @Delete(':id')
    // async remove(@Param('id') id: number): Promise<any> {
    //     return this.adjustmentService.remove(id);
    // }
}
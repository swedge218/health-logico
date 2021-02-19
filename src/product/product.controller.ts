import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req} from '@nestjs/common';
import {ProductService} from "./product.service";
import {Product} from "./domain/product.entity";
import {CreateProductDTO} from "./domain/dto/create.product.dto";
import {ResponseBuilder} from "../utils/ResponseBuilder";
import {RequiredPermissions} from "../permission/decorators/permissions.decorator";
import {PermissionsEnum} from "../permission/domain/enums/permissions.enum";
import {Closed} from "../auth/decorators/closed.decorator";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @RequiredPermissions(PermissionsEnum.VIEW_PRODUCT)
    @Get()
    async findAll(
        @Req() req,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<any> {

        return this.productService.findAll({
            page: page,
            limit: limit,
            path: req.path
        });
    }

    @RequiredPermissions(PermissionsEnum.VIEW_PRODUCT)
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Product> {
        return this.productService.findOne(id)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @Closed()
    @Get('/summary/product/:pId/hospital/:hId?')
    async findFullDetails(
        @Param('pId') productId: number,
        @Param('hId') hospitalId: number): Promise<Product> {
        return this.productService.findFullDetails(productId, hospitalId)
            .then(adjustment => {
                return ResponseBuilder.makeFindResponder(adjustment);
            });
    }

    @RequiredPermissions(PermissionsEnum.CREATE_PRODUCT)
    @Post()
    create(@Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productService.create(createProductDTO);
    }

    @RequiredPermissions(PermissionsEnum.UPDATE_PRODUCT)
    @Put(':id')
    async update(@Param('id') id: number,
                 @Body() createProductDTO: CreateProductDTO): Promise<Product> {
        return this.productService.update(id,  createProductDTO);
    }

    @RequiredPermissions(PermissionsEnum.DELETE_PRODUCT)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<any> {
        return this.productService.remove(id);
    }
}

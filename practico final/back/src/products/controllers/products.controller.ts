import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import {
  CreateProductInput,
  Product,
  ProductSortField,
  UpdateProductInput,
  UpdateStockInput,
} from '../product.types';
import { PaginatedResult } from '../../common/pagination';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/user-role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('sortBy') sortBy?: ProductSortField,
    @Query('order') order?: 'asc' | 'desc' | 'ASC' | 'DESC',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResult<Product>> {
    return this.productsService.findAll({
      name,
      sortBy,
      order,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() body: CreateProductInput): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.remove(id);
  }

  @Patch(':id/stock')
  reduceStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStockInput,
  ): Promise<Product> {
    return this.productsService.reduceStock(id, body.quantity);
  }
}

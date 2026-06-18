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
  create(@Body() body: CreateProductInput): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
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

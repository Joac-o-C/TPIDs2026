import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository';
import { TypeOrmProductsRepository } from './repositories/typeorm-products.repository';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './services/products.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository },
  ],
  exports: [ProductsService, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}

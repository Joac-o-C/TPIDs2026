import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { CATEGORIES_REPOSITORY } from './repositories/categories.repository';
import { TypeOrmCategoriesRepository } from './repositories/typeorm-categories.repository';
import { CategoryEntity } from './entities/category.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CATEGORIES_REPOSITORY,
      useClass: TypeOrmCategoriesRepository,
    },
  ],
  exports: [CategoriesService, CATEGORIES_REPOSITORY],
})
export class CategoriesModule {}

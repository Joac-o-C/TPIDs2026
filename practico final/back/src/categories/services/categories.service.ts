import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../category.types';
import {
  CATEGORIES_REPOSITORY,
  CategoriesRepository,
} from '../repositories/categories.repository';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../../products/repositories/products.repository';
import {
  buildPaginated,
  PaginatedResult,
  normalizePagination,
} from '../../common/pagination';
import { Product } from '../../products/product.types';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async findAll(): Promise<Category[]> {
    return (await this.categoriesRepository.findAll()).data;
  }

  async findOne(id: number): Promise<Category> {
    const cat = await this.categoriesRepository.findById(id);
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const name = input.name?.trim() ?? '';
    const { data } = await this.categoriesRepository.findAll();
    const duplicate = data.some(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      throw new ConflictException('Category name already exists');
    }
    return this.categoriesRepository.create({ ...input, name });
  }

  async update(id: number, input: UpdateCategoryInput): Promise<Category> {
    const updated = await this.categoriesRepository.update(id, input);
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async remove(id: number): Promise<Category> {
    const cat = await this.categoriesRepository.findById(id);
    if (!cat) throw new NotFoundException('Category not found');
    // Desasociamos los productos (categoryId = null) antes de borrar la
    // categoría, en vez de bloquear con 409. Así el borrado siempre procede y
    // los productos quedan sin categoría (no se eliminan).
    await this.productsRepository.detachCategory(id);
    return (await this.categoriesRepository.remove(id))!;
  }

  async findProducts(
    id: number,
    query: { page?: number; limit?: number } = {},
  ): Promise<PaginatedResult<Product>> {
    await this.findOne(id);
    const { page, limit } = normalizePagination(query.page, query.limit);
    const { data, total } = await this.productsRepository.findAll({
      categoryId: id,
      page,
      limit,
    });
    return buildPaginated(data, total, page, limit);
  }

  async exists(id: number): Promise<boolean> {
    return (await this.categoriesRepository.findById(id)) !== undefined;
  }
}

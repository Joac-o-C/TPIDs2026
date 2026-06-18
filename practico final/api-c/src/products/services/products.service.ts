import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductInput,
  Product,
  ProductsQueryOptions,
  UpdateProductInput,
} from '../product.types';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository';
import { CategoriesService } from '../../categories/services/categories.service';
import {
  buildPaginated,
  normalizePagination,
  PaginatedResult,
} from '../../common/pagination';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(
    query: ProductsQueryOptions = {},
  ): Promise<PaginatedResult<Product>> {
    const { page, limit } = normalizePagination(query.page, query.limit);
    const { data, total } = await this.productsRepository.findAll({
      ...query,
      page,
      limit,
    });
    return buildPaginated(data, total, page, limit);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    if (!(await this.categoriesService.exists(input.categoryId))) {
      throw new BadRequestException('categoryId does not exist');
    }
    return this.productsRepository.create(input);
  }

  async update(id: number, input: UpdateProductInput): Promise<Product> {
    if (
      input.categoryId !== undefined &&
      !(await this.categoriesService.exists(input.categoryId))
    ) {
      throw new BadRequestException('categoryId does not exist');
    }
    const product = await this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async reduceStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    if (quantity > product.stock) {
      throw new BadRequestException('Stock insuficiente');
    }
    const updated = await this.productsRepository.updateStock(
      id,
      product.stock - quantity,
    );
    return updated!;
  }
}

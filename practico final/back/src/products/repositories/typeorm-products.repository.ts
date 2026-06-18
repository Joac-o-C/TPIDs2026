import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import {
  CreateProductInput,
  Product,
  ProductsQueryOptions,
  UpdateProductInput,
} from '../product.types';
import { ProductsRepository } from './products.repository';

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async findAll(
    opts: ProductsQueryOptions = {},
  ): Promise<{ data: Product[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (opts.name) where.name = ILike(`%${opts.name}%`);
    if (opts.categoryId !== undefined) where.categoryId = opts.categoryId;

    const order: Record<string, 'ASC' | 'DESC'> = {};
    if (opts.sortBy) {
      order[opts.sortBy] =
        String(opts.order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    }

    const skip =
      opts.page && opts.limit ? (opts.page - 1) * opts.limit : undefined;

    const [data, total] = await this.repo.findAndCount({
      where,
      order,
      skip,
      take: opts.limit,
    });
    return { data, total };
  }

  async findById(id: number): Promise<Product | undefined> {
    return (await this.repo.findOne({ where: { id } })) ?? undefined;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const entity = this.repo.create(input);
    return this.repo.save(entity);
  }

  async update(
    id: number,
    input: UpdateProductInput,
  ): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;
    await this.repo.update(id, input);
    return (await this.findById(id))!;
  }

  async remove(id: number): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;
    await this.repo.delete(id);
    return product;
  }

  async updateStock(
    id: number,
    newStock: number,
  ): Promise<Product | undefined> {
    const product = await this.findById(id);
    if (!product) return undefined;
    await this.repo.update(id, { stock: newStock });
    return { ...product, stock: newStock };
  }

  async countByCategoryId(categoryId: number): Promise<number> {
    return this.repo.count({ where: { categoryId } });
  }
}

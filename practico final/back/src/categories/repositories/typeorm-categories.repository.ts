import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import {
  CategoriesQueryOptions,
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../category.types';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class TypeOrmCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  async findAll(
    opts: CategoriesQueryOptions = {},
  ): Promise<{ data: Category[]; total: number }> {
    const skip =
      opts.page && opts.limit ? (opts.page - 1) * opts.limit : undefined;
    const [data, total] = await this.repo.findAndCount({
      order: { id: 'ASC' },
      skip,
      take: opts.limit,
    });
    return { data, total };
  }

  async findById(id: number): Promise<Category | undefined> {
    return (await this.repo.findOne({ where: { id } })) ?? undefined;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const entity = this.repo.create({ name: input.name });
    return this.repo.save(entity);
  }

  async update(
    id: number,
    input: UpdateCategoryInput,
  ): Promise<Category | undefined> {
    const cat = await this.findById(id);
    if (!cat) return undefined;
    await this.repo.update(id, { name: input.name });
    return { ...cat, name: input.name };
  }

  async remove(id: number): Promise<Category | undefined> {
    const cat = await this.findById(id);
    if (!cat) return undefined;
    await this.repo.delete(id);
    return cat;
  }
}

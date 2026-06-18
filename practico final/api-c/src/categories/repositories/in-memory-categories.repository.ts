import {
  CategoriesQueryOptions,
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../category.types';
import { CategoriesRepository } from './categories.repository';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  private categories: Category[] = [];
  private nextId = 1;

  async findAll(
    opts: CategoriesQueryOptions = {},
  ): Promise<{ data: Category[]; total: number }> {
    let result = [...this.categories];
    const total = result.length;
    if (opts.page && opts.limit) {
      const start = (opts.page - 1) * opts.limit;
      result = result.slice(start, start + opts.limit);
    }
    return { data: result, total };
  }

  async findById(id: number): Promise<Category | undefined> {
    return this.categories.find((c) => c.id === id);
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const cat: Category = { id: this.nextId++, name: input.name };
    this.categories.push(cat);
    return cat;
  }

  async update(
    id: number,
    input: UpdateCategoryInput,
  ): Promise<Category | undefined> {
    const cat = await this.findById(id);
    if (!cat) return undefined;
    cat.name = input.name;
    return cat;
  }

  async remove(id: number): Promise<Category | undefined> {
    const cat = await this.findById(id);
    if (!cat) return undefined;
    this.categories = this.categories.filter((c) => c.id !== id);
    return cat;
  }
}

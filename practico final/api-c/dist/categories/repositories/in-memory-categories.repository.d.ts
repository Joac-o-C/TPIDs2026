import { CategoriesQueryOptions, Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';
import { CategoriesRepository } from './categories.repository';
export declare class InMemoryCategoriesRepository implements CategoriesRepository {
    private categories;
    private nextId;
    findAll(opts?: CategoriesQueryOptions): Promise<{
        data: Category[];
        total: number;
    }>;
    findById(id: number): Promise<Category | undefined>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: number, input: UpdateCategoryInput): Promise<Category | undefined>;
    remove(id: number): Promise<Category | undefined>;
}

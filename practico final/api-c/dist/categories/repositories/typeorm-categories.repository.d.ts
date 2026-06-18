import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoriesQueryOptions, Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';
import { CategoriesRepository } from './categories.repository';
export declare class TypeOrmCategoriesRepository implements CategoriesRepository {
    private readonly repo;
    constructor(repo: Repository<CategoryEntity>);
    findAll(opts?: CategoriesQueryOptions): Promise<{
        data: Category[];
        total: number;
    }>;
    findById(id: number): Promise<Category | undefined>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: number, input: UpdateCategoryInput): Promise<Category | undefined>;
    remove(id: number): Promise<Category | undefined>;
}

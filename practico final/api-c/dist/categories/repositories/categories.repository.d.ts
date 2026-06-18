import { CategoriesQueryOptions, Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';
export declare const CATEGORIES_REPOSITORY = "CATEGORIES_REPOSITORY";
export interface CategoriesRepository {
    findAll(opts?: CategoriesQueryOptions): Promise<{
        data: Category[];
        total: number;
    }>;
    findById(id: number): Promise<Category | undefined>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: number, input: UpdateCategoryInput): Promise<Category | undefined>;
    remove(id: number): Promise<Category | undefined>;
}

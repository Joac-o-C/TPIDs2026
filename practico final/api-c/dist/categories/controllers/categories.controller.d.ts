import { CategoriesService } from '../services/categories.service';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';
import { PaginatedResult } from '../../common/pagination';
import { Product } from '../../products/product.types';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    create(body: CreateCategoryInput): Promise<Category>;
    update(id: number, body: UpdateCategoryInput): Promise<Category>;
    remove(id: number): Promise<Category>;
    findProducts(id: number, page?: string, limit?: string): Promise<PaginatedResult<Product>>;
}

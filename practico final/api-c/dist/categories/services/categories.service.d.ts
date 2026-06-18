import { Category, CreateCategoryInput, UpdateCategoryInput } from '../category.types';
import { CategoriesRepository } from '../repositories/categories.repository';
import { ProductsRepository } from '../../products/repositories/products.repository';
import { PaginatedResult } from '../../common/pagination';
import { Product } from '../../products/product.types';
export declare class CategoriesService {
    private readonly categoriesRepository;
    private readonly productsRepository;
    constructor(categoriesRepository: CategoriesRepository, productsRepository: ProductsRepository);
    findAll(): Promise<Category[]>;
    findOne(id: number): Promise<Category>;
    create(input: CreateCategoryInput): Promise<Category>;
    update(id: number, input: UpdateCategoryInput): Promise<Category>;
    remove(id: number): Promise<Category>;
    findProducts(id: number, query?: {
        page?: number;
        limit?: number;
    }): Promise<PaginatedResult<Product>>;
    exists(id: number): Promise<boolean>;
}

import { CreateProductInput, Product, ProductsQueryOptions, UpdateProductInput } from '../product.types';
import { ProductsRepository } from '../repositories/products.repository';
import { CategoriesService } from '../../categories/services/categories.service';
import { PaginatedResult } from '../../common/pagination';
export declare class ProductsService {
    private readonly productsRepository;
    private readonly categoriesService;
    constructor(productsRepository: ProductsRepository, categoriesService: CategoriesService);
    findAll(query?: ProductsQueryOptions): Promise<PaginatedResult<Product>>;
    findOne(id: number): Promise<Product>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: number, input: UpdateProductInput): Promise<Product>;
    remove(id: number): Promise<Product>;
    reduceStock(id: number, quantity: number): Promise<Product>;
}

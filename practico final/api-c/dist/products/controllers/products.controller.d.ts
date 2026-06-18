import { ProductsService } from '../services/products.service';
import { CreateProductInput, Product, ProductSortField, UpdateProductInput, UpdateStockInput } from '../product.types';
import { PaginatedResult } from '../../common/pagination';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(name?: string, sortBy?: ProductSortField, order?: 'asc' | 'desc' | 'ASC' | 'DESC', page?: string, limit?: string): Promise<PaginatedResult<Product>>;
    findOne(id: number): Promise<Product>;
    create(body: CreateProductInput): Promise<Product>;
    update(id: number, body: UpdateProductInput): Promise<Product>;
    remove(id: number): Promise<Product>;
    reduceStock(id: number, body: UpdateStockInput): Promise<Product>;
}

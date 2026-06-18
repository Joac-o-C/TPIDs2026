import { CreateProductInput, Product, ProductsQueryOptions, UpdateProductInput } from '../product.types';
import { ProductsRepository } from './products.repository';
export declare class InMemoryProductsRepository implements ProductsRepository {
    private products;
    private nextId;
    findAll(opts?: ProductsQueryOptions): Promise<{
        data: Product[];
        total: number;
    }>;
    findById(id: number): Promise<Product | undefined>;
    create(input: CreateProductInput): Promise<Product>;
    update(id: number, input: UpdateProductInput): Promise<Product | undefined>;
    remove(id: number): Promise<Product | undefined>;
    updateStock(id: number, newStock: number): Promise<Product | undefined>;
    countByCategoryId(categoryId: number): Promise<number>;
}

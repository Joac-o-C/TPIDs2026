import {
  CreateProductInput,
  Product,
  ProductsQueryOptions,
  UpdateProductInput,
} from '../product.types';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  findAll(
    opts?: ProductsQueryOptions,
  ): Promise<{ data: Product[]; total: number }>;
  findById(id: number): Promise<Product | undefined>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: number, input: UpdateProductInput): Promise<Product | undefined>;
  remove(id: number): Promise<Product | undefined>;
  updateStock(id: number, newStock: number): Promise<Product | undefined>;
  countByCategoryId(categoryId: number): Promise<number>;
  /** Desasocia (categoryId = null) todos los productos de una categoría. */
  detachCategory(categoryId: number): Promise<void>;
}

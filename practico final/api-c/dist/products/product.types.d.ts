export type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    categoryId: number;
};
export declare class CreateProductInput {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
}
export declare class UpdateProductInput {
    name?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
}
export declare class UpdateStockInput {
    quantity: number;
}
export type ProductSortField = 'id' | 'name' | 'price' | 'stock';
export type ProductsQueryOptions = {
    name?: string;
    categoryId?: number;
    sortBy?: ProductSortField;
    order?: 'asc' | 'desc' | 'ASC' | 'DESC';
    page?: number;
    limit?: number;
};

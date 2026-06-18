export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
export type PaginatedResult<T> = {
    data: T[];
    meta: PaginationMeta;
};
export declare const MAX_LIMIT = 50;
export declare const DEFAULT_LIMIT = 10;
export declare function normalizePagination(page?: number | string, limit?: number | string): {
    page: number;
    limit: number;
};
export declare function buildPaginated<T>(data: T[], total: number, page: number, limit: number): PaginatedResult<T>;

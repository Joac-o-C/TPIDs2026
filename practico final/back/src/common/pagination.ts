export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const MAX_LIMIT = 50;
export const DEFAULT_LIMIT = 10;

export function normalizePagination(
  page?: number | string,
  limit?: number | string,
): { page: number; limit: number } {
  const parsedPage = Math.max(1, Number(page) || 1);
  const rawLimit = Number(limit) || DEFAULT_LIMIT;
  const parsedLimit = Math.min(MAX_LIMIT, Math.max(1, rawLimit));
  return { page: parsedPage, limit: parsedLimit };
}

export function buildPaginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    items: data,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

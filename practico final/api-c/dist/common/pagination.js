"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LIMIT = exports.MAX_LIMIT = void 0;
exports.normalizePagination = normalizePagination;
exports.buildPaginated = buildPaginated;
exports.MAX_LIMIT = 50;
exports.DEFAULT_LIMIT = 10;
function normalizePagination(page, limit) {
    const parsedPage = Math.max(1, Number(page) || 1);
    const rawLimit = Number(limit) || exports.DEFAULT_LIMIT;
    const parsedLimit = Math.min(exports.MAX_LIMIT, Math.max(1, rawLimit));
    return { page: parsedPage, limit: parsedLimit };
}
function buildPaginated(data, total, page, limit) {
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        },
    };
}
//# sourceMappingURL=pagination.js.map
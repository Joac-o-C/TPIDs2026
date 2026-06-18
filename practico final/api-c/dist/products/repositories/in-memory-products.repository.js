"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProductsRepository = void 0;
class InMemoryProductsRepository {
    products = [];
    nextId = 1;
    async findAll(opts = {}) {
        let result = [...this.products];
        if (opts.name) {
            const q = opts.name.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(q));
        }
        if (opts.categoryId !== undefined) {
            result = result.filter((p) => p.categoryId === opts.categoryId);
        }
        if (opts.sortBy) {
            const dir = String(opts.order).toUpperCase() === 'DESC' ? -1 : 1;
            result.sort((a, b) => {
                const av = a[opts.sortBy];
                const bv = b[opts.sortBy];
                if (av < bv)
                    return -1 * dir;
                if (av > bv)
                    return 1 * dir;
                return 0;
            });
        }
        const total = result.length;
        if (opts.page && opts.limit) {
            const start = (opts.page - 1) * opts.limit;
            result = result.slice(start, start + opts.limit);
        }
        return { data: result, total };
    }
    async findById(id) {
        return this.products.find((p) => p.id === id);
    }
    async create(input) {
        const product = {
            id: this.nextId++,
            name: input.name,
            price: input.price,
            stock: input.stock,
            categoryId: input.categoryId,
        };
        this.products.push(product);
        return product;
    }
    async update(id, input) {
        const product = await this.findById(id);
        if (!product)
            return undefined;
        if (input.name !== undefined)
            product.name = input.name;
        if (input.price !== undefined)
            product.price = input.price;
        if (input.stock !== undefined)
            product.stock = input.stock;
        if (input.categoryId !== undefined)
            product.categoryId = input.categoryId;
        return product;
    }
    async remove(id) {
        const product = await this.findById(id);
        if (!product)
            return undefined;
        this.products = this.products.filter((p) => p.id !== id);
        return product;
    }
    async updateStock(id, newStock) {
        const product = await this.findById(id);
        if (!product)
            return undefined;
        product.stock = newStock;
        return product;
    }
    async countByCategoryId(categoryId) {
        return this.products.filter((p) => p.categoryId === categoryId).length;
    }
}
exports.InMemoryProductsRepository = InMemoryProductsRepository;
//# sourceMappingURL=in-memory-products.repository.js.map
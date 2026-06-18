"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCategoriesRepository = void 0;
class InMemoryCategoriesRepository {
    categories = [];
    nextId = 1;
    async findAll(opts = {}) {
        let result = [...this.categories];
        const total = result.length;
        if (opts.page && opts.limit) {
            const start = (opts.page - 1) * opts.limit;
            result = result.slice(start, start + opts.limit);
        }
        return { data: result, total };
    }
    async findById(id) {
        return this.categories.find((c) => c.id === id);
    }
    async create(input) {
        const cat = { id: this.nextId++, name: input.name };
        this.categories.push(cat);
        return cat;
    }
    async update(id, input) {
        const cat = await this.findById(id);
        if (!cat)
            return undefined;
        cat.name = input.name;
        return cat;
    }
    async remove(id) {
        const cat = await this.findById(id);
        if (!cat)
            return undefined;
        this.categories = this.categories.filter((c) => c.id !== id);
        return cat;
    }
}
exports.InMemoryCategoriesRepository = InMemoryCategoriesRepository;
//# sourceMappingURL=in-memory-categories.repository.js.map
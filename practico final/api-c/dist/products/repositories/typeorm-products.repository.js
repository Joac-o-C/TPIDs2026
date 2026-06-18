"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
let TypeOrmProductsRepository = class TypeOrmProductsRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(opts = {}) {
        const where = {};
        if (opts.name)
            where.name = (0, typeorm_2.ILike)(`%${opts.name}%`);
        if (opts.categoryId !== undefined)
            where.categoryId = opts.categoryId;
        const order = {};
        if (opts.sortBy) {
            order[opts.sortBy] =
                String(opts.order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        }
        const skip = opts.page && opts.limit ? (opts.page - 1) * opts.limit : undefined;
        const [data, total] = await this.repo.findAndCount({
            where,
            order,
            skip,
            take: opts.limit,
        });
        return { data, total };
    }
    async findById(id) {
        return (await this.repo.findOne({ where: { id } })) ?? undefined;
    }
    async create(input) {
        const entity = this.repo.create(input);
        return this.repo.save(entity);
    }
    async update(id, input) {
        const product = await this.findById(id);
        if (!product)
            return undefined;
        await this.repo.update(id, input);
        return (await this.findById(id));
    }
    async remove(id) {
        const product = await this.findById(id);
        if (!product)
            return undefined;
        await this.repo.delete(id);
        return product;
    }
    async updateStock(id, newStock) {
        const product = await this.findById(id);
        if (!product)
            return undefined;
        await this.repo.update(id, { stock: newStock });
        return { ...product, stock: newStock };
    }
    async countByCategoryId(categoryId) {
        return this.repo.count({ where: { categoryId } });
    }
};
exports.TypeOrmProductsRepository = TypeOrmProductsRepository;
exports.TypeOrmProductsRepository = TypeOrmProductsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], TypeOrmProductsRepository);
//# sourceMappingURL=typeorm-products.repository.js.map
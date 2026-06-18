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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const categories_repository_1 = require("../repositories/categories.repository");
const products_repository_1 = require("../../products/repositories/products.repository");
const pagination_1 = require("../../common/pagination");
let CategoriesService = class CategoriesService {
    categoriesRepository;
    productsRepository;
    constructor(categoriesRepository, productsRepository) {
        this.categoriesRepository = categoriesRepository;
        this.productsRepository = productsRepository;
    }
    async findAll() {
        return (await this.categoriesRepository.findAll()).data;
    }
    async findOne(id) {
        const cat = await this.categoriesRepository.findById(id);
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return cat;
    }
    async create(input) {
        return this.categoriesRepository.create(input);
    }
    async update(id, input) {
        const updated = await this.categoriesRepository.update(id, input);
        if (!updated)
            throw new common_1.NotFoundException('Category not found');
        return updated;
    }
    async remove(id) {
        const cat = await this.categoriesRepository.findById(id);
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        const count = await this.productsRepository.countByCategoryId(id);
        if (count > 0) {
            throw new common_1.ConflictException('Category has associated products, cannot delete');
        }
        return (await this.categoriesRepository.remove(id));
    }
    async findProducts(id, query = {}) {
        await this.findOne(id);
        const { page, limit } = (0, pagination_1.normalizePagination)(query.page, query.limit);
        const { data, total } = await this.productsRepository.findAll({
            categoryId: id,
            page,
            limit,
        });
        return (0, pagination_1.buildPaginated)(data, total, page, limit);
    }
    async exists(id) {
        return (await this.categoriesRepository.findById(id)) !== undefined;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(categories_repository_1.CATEGORIES_REPOSITORY)),
    __param(1, (0, common_1.Inject)(products_repository_1.PRODUCTS_REPOSITORY)),
    __metadata("design:paramtypes", [typeof (_a = typeof categories_repository_1.CategoriesRepository !== "undefined" && categories_repository_1.CategoriesRepository) === "function" ? _a : Object, typeof (_b = typeof products_repository_1.ProductsRepository !== "undefined" && products_repository_1.ProductsRepository) === "function" ? _b : Object])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map
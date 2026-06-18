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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_repository_1 = require("../repositories/products.repository");
const categories_service_1 = require("../../categories/services/categories.service");
const pagination_1 = require("../../common/pagination");
let ProductsService = class ProductsService {
    productsRepository;
    categoriesService;
    constructor(productsRepository, categoriesService) {
        this.productsRepository = productsRepository;
        this.categoriesService = categoriesService;
    }
    async findAll(query = {}) {
        const { page, limit } = (0, pagination_1.normalizePagination)(query.page, query.limit);
        const { data, total } = await this.productsRepository.findAll({
            ...query,
            page,
            limit,
        });
        return (0, pagination_1.buildPaginated)(data, total, page, limit);
    }
    async findOne(id) {
        const product = await this.productsRepository.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async create(input) {
        if (!(await this.categoriesService.exists(input.categoryId))) {
            throw new common_1.BadRequestException('categoryId does not exist');
        }
        return this.productsRepository.create(input);
    }
    async update(id, input) {
        if (input.categoryId !== undefined &&
            !(await this.categoriesService.exists(input.categoryId))) {
            throw new common_1.BadRequestException('categoryId does not exist');
        }
        const product = await this.productsRepository.update(id, input);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async remove(id) {
        const product = await this.productsRepository.remove(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async reduceStock(id, quantity) {
        const product = await this.productsRepository.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (quantity > product.stock) {
            throw new common_1.BadRequestException('Stock insuficiente');
        }
        const updated = await this.productsRepository.updateStock(id, product.stock - quantity);
        return updated;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(products_repository_1.PRODUCTS_REPOSITORY)),
    __metadata("design:paramtypes", [typeof (_a = typeof products_repository_1.ProductsRepository !== "undefined" && products_repository_1.ProductsRepository) === "function" ? _a : Object, typeof (_b = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" ? _b : Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map
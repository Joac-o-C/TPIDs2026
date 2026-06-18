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
exports.TypeOrmCategoriesRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
let TypeOrmCategoriesRepository = class TypeOrmCategoriesRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(opts = {}) {
        const skip = opts.page && opts.limit ? (opts.page - 1) * opts.limit : undefined;
        const [data, total] = await this.repo.findAndCount({
            order: { id: 'ASC' },
            skip,
            take: opts.limit,
        });
        return { data, total };
    }
    async findById(id) {
        return (await this.repo.findOne({ where: { id } })) ?? undefined;
    }
    async create(input) {
        const entity = this.repo.create({ name: input.name });
        return this.repo.save(entity);
    }
    async update(id, input) {
        const cat = await this.findById(id);
        if (!cat)
            return undefined;
        await this.repo.update(id, { name: input.name });
        return { ...cat, name: input.name };
    }
    async remove(id) {
        const cat = await this.findById(id);
        if (!cat)
            return undefined;
        await this.repo.delete(id);
        return cat;
    }
};
exports.TypeOrmCategoriesRepository = TypeOrmCategoriesRepository;
exports.TypeOrmCategoriesRepository = TypeOrmCategoriesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], TypeOrmCategoriesRepository);
//# sourceMappingURL=typeorm-categories.repository.js.map
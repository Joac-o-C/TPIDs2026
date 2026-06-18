"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const products_module_1 = require("./products/products.module");
const placeholder_users_module_1 = require("./placeholder-users/placeholder-users.module");
const categories_module_1 = require("./categories/categories.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const product_entity_1 = require("./products/entities/product.entity");
const user_entity_1 = require("./users/user.entity");
const category_entity_1 = require("./categories/entities/category.entity");
const logger_middleware_1 = require("./common/middlewares/logger.middleware");
const timing_middleware_1 = require("./common/middlewares/timing.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware, timing_middleware_1.TimingMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (cfg) => ({
                    type: 'postgres',
                    host: cfg.get('DB_HOST') ?? 'localhost',
                    port: Number(cfg.get('DB_PORT') ?? 5432),
                    username: cfg.get('DB_USER') ?? 'postgres',
                    password: cfg.get('DB_PASSWORD') ?? 'postgres',
                    database: cfg.get('DB_NAME') ?? 'tpids',
                    entities: [product_entity_1.ProductEntity, user_entity_1.UserEntity, category_entity_1.CategoryEntity],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            placeholder_users_module_1.PlaceholderUsersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
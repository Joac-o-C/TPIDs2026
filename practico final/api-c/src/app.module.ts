import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PlaceholderUsersModule } from './placeholder-users/placeholder-users.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductEntity } from './products/entities/product.entity';
import { UserEntity } from './users/user.entity';
import { CategoryEntity } from './categories/entities/category.entity';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TimingMiddleware } from './common/middlewares/timing.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST') ?? 'localhost',
        port: Number(cfg.get<string>('DB_PORT') ?? 5432),
        username: cfg.get<string>('DB_USER') ?? 'postgres',
        password: cfg.get<string>('DB_PASSWORD') ?? 'postgres',
        database: cfg.get<string>('DB_NAME') ?? 'tpids',
        entities: [ProductEntity, UserEntity, CategoryEntity],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    PlaceholderUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware, TimingMiddleware).forRoutes('*');
  }
}

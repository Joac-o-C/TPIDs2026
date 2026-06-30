import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number | null;
};

export class CreateProductInput {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsInt()
  @IsPositive()
  categoryId!: number;
}

export class UpdateProductInput {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId?: number;
}

export class UpdateStockInput {
  @IsInt()
  @IsPositive()
  quantity!: number;
}

export type ProductSortField = 'id' | 'name' | 'price' | 'stock';

export type ProductsQueryOptions = {
  name?: string;
  categoryId?: number;
  sortBy?: ProductSortField;
  order?: 'asc' | 'desc' | 'ASC' | 'DESC';
  page?: number;
  limit?: number;
};

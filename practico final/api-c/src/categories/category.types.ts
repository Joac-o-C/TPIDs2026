import { IsString, Length } from 'class-validator';

export type Category = {
  id: number;
  name: string;
};

export class CreateCategoryInput {
  @IsString()
  @Length(2, 100)
  name!: string;
}

export class UpdateCategoryInput {
  @IsString()
  @Length(2, 100)
  name!: string;
}

export type CategoriesQueryOptions = {
  page?: number;
  limit?: number;
};

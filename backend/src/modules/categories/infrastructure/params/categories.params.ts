import { CategoriesFilterCriteria } from '@modules/categories/application/usecases/categories-search.usecase';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindOneCategoryParams {
  @IsUUID('4')
  id: string;
}

export class SearchByKeywordParams {
  @IsString()
  keyword: string;
}

export class FilterCategoryByCriteriaParams implements CategoriesFilterCriteria {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return value.toLowerCase() === 'true';
  })
  isActive?: boolean;
}

export class UpdateCategoryParams extends FindOneCategoryParams {}

export class DeleteCategoryParams extends FindOneCategoryParams {}

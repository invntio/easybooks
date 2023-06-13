import { ProductsFilterCriteria } from '@modules/products/application/usecases/products-search.usecase';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindOneProductParams {
  @IsUUID('4')
  id: string;
}

export class SearchProductByKeywordParams {
  @IsString()
  keyword: string;
}

export class FilterProductByCriteriaParams implements ProductsFilterCriteria {
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

export class UpdateProductParams extends FindOneProductParams {}

export class DeleteProductParams extends FindOneProductParams {}

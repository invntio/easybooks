import { IsUUID } from 'class-validator';

export class FindOneCategoryParams {
  @IsUUID('4')
  id: string;
}

export class UpdateCategoryParams extends FindOneCategoryParams {}

export class DeleteCategoryParams extends FindOneCategoryParams {}

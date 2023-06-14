import { CategoriesUseCase } from '@modules/categories/application/usecases/categories.usecase';
import { Category } from '@modules/categories/domain/entity/category.entity';
import { ProductCategoriesService } from './products-categories-service.abstract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductCategoriesUseCaseService extends ProductCategoriesService {
  constructor(private readonly categoriesUseCase: CategoriesUseCase) {
    super();
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    return this.categoriesUseCase.getCategoryById(categoryId);
  }
}

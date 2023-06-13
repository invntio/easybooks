import { Category } from '@modules/categories/domain/entity/category.entity';

export abstract class ProductCategoriesService {
  abstract getCategoryById(categoryId: string): Promise<Category>;
}

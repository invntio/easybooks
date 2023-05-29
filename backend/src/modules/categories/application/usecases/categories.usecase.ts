import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/entity/category.entity';

@Injectable()
export class CategoriesUseCase {
  private readonly logger = new Logger(CategoriesUseCase.name);
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoriesRepository.findOne({
      where: { id: id },
    });
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoriesRepository.create(categoryData);
    return this.categoriesRepository.save(category);
  }

  async updateCategory(
    id: string,
    categoryData: Partial<Category>,
  ): Promise<Category | null> {
    const category = await this.getCategoryById(id);
    if (!category) {
      return null;
    }

    Object.assign(category, categoryData);
    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.categoriesRepository.delete(id);
    return result.affected > 0;
  }
}

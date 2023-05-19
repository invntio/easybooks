import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../../domain/entity/category.entity';

@Injectable()
export class CategoriesUseCase {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id: id },
    });
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
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
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return result.affected > 0;
  }
}

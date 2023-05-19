import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { Category } from '../../domain/entity/category.entity';

@Injectable()
export class CategorySearchUseCase {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async searchCategoriesByKeyword(keyword: string): Promise<Category[]> {
    const searchOptions = {
      where: {
        name: Like(`%${keyword}%`),
      },
    };

    const categories = await this.categoryRepository.find(searchOptions);
    return categories;
  }

  async filterCategoriesByCriteria(
    criteria: FindManyOptions,
  ): Promise<Category[]> {
    const categories = await this.categoryRepository.find(criteria);
    return categories;
  }
}

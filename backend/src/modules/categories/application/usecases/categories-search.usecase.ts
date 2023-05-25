import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';

import { Category } from '../../domain/entity/category.entity';

export class CategoryFilterCriteria {
  name?: string;
  isActive?: boolean;
}

@Injectable()
export class CategorySearchUseCase {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async searchCategoriesByKeyword(keyword: string): Promise<Category[]> {
    const searchOptions: FindManyOptions = {
      where: {
        name: keyword && Like(`%${keyword}%`),
      },
    };

    const categories = await this.categoryRepository.find(searchOptions);
    return categories;
  }

  async filterCategoriesByCriteria(
    criteria: CategoryFilterCriteria,
  ): Promise<Category[]> {
    const filterOptions: FindOptionsWhere<Category> = {
      name: criteria.name && Like(`%${criteria.name}%`),
      isActive: criteria.isActive,
    };

    const categories = await this.categoryRepository.findBy(filterOptions);
    return categories;
  }
}

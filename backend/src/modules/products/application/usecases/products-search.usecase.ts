import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';

import { Product } from '../../domain/entity/product.entity';

export class ProductsFilterCriteria {
  name?: string;
  isActive?: boolean;
}

@Injectable()
export class ProductsSearchUseCase {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async searchProductsByKeyword(keyword: string): Promise<Product[]> {
    const searchOptions: FindManyOptions = {
      where: {
        name: keyword && Like(`%${keyword}%`),
      },
    };

    const products = await this.productRepository.find(searchOptions);
    return products;
  }

  async filterProductsByCriteria(
    criteria: ProductsFilterCriteria,
  ): Promise<Product[]> {
    const filterOptions: FindOptionsWhere<Product> = {
      name: criteria.name && Like(`%${criteria.name}%`),
    };

    const products = await this.productRepository.findBy(filterOptions);
    return products;
  }
}

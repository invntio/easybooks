import { Test, TestingModule } from '@nestjs/testing';
import { ProductsSearchUseCase } from './products-search.usecase';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Product } from '../../domain/entity/product.entity';
import { v4 as uuidV4 } from 'uuid';

describe('ProductSearchUseCase', () => {
  let productSearchUseCase: ProductsSearchUseCase;
  let productsRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsSearchUseCase,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    productSearchUseCase = module.get<ProductsSearchUseCase>(
      ProductsSearchUseCase,
    );
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  describe('searchProductsByKeyword', () => {
    it('should return products that match the keyword', async () => {
      // Arrange
      const keyword = 'example';
      const expectedProducts: Product[] = [
        {
          id: uuidV4(),
          name: 'Product 1',
          createdAt: new Date(),
        },
        {
          id: uuidV4(),
          name: 'Product 2',
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(productsRepository, 'find')
        .mockResolvedValue(expectedProducts);

      // Act
      const result = await productSearchUseCase.searchProductsByKeyword(
        keyword,
      );

      // Assert
      expect(productsRepository.find).toHaveBeenCalledWith({
        where: {
          name: keyword && Like(`%${keyword}%`),
        },
      });
      expect(result).toEqual(expectedProducts);
    });

    it('should return an empty array if no products match the keyword', async () => {
      // Arrange
      const keyword = 'example';
      const expectedProducts: Product[] = [];
      jest.spyOn(productsRepository, 'find').mockResolvedValue([]);

      // Act
      const result = await productSearchUseCase.searchProductsByKeyword(
        keyword,
      );

      // Assert
      expect(productsRepository.find).toHaveBeenCalledWith({
        where: {
          name: keyword && Like(`%${keyword}%`),
        },
      });
      expect(result).toEqual(expectedProducts);
    });
  });

  describe('filterProductsByCriteria', () => {
    it('should return products based on the provided criteria', async () => {
      // Arrange
      const criteria: Partial<Product> = {
        name: 'Product',
        isActive: true,
      };
      const filterOptions: FindOptionsWhere<Product> = {
        name: criteria.name && Like(`%${criteria.name}%`),
        isActive: criteria.isActive,
      };
      const expectedProducts: Product[] = [
        {
          id: uuidV4(),
          name: 'Product 1',
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: uuidV4(),
          name: 'Product 2',
          isActive: true,
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(productsRepository, 'findBy')
        .mockResolvedValue(expectedProducts);

      // Act
      const result = await productSearchUseCase.filterProductsByCriteria(
        criteria,
      );

      // Assert
      expect(productsRepository.findBy).toHaveBeenCalledWith(filterOptions);
      expect(result).toEqual(expectedProducts);
    });

    it('should return an empty array if no products meet the criteria', async () => {
      // Arrange
      const criteria: Partial<Product> = {
        name: 'Product ABC',
        isActive: true,
      };

      const filterOptions: FindOptionsWhere<Product> = {
        name: criteria.name && Like(`%${criteria.name}%`),
        isActive: criteria.isActive,
      };

      const expectedProducts: Product[] = [];
      jest.spyOn(productsRepository, 'findBy').mockResolvedValue([]);

      // Act
      const result = await productSearchUseCase.filterProductsByCriteria(
        criteria,
      );

      // Assert
      expect(productsRepository.findBy).toHaveBeenCalledWith(filterOptions);
      expect(result).toEqual(expectedProducts);
    });
  });
});

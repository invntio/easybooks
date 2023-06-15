import { Test, TestingModule } from '@nestjs/testing';
import { ProductsSearchUseCase } from './products-search.usecase';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Product } from '../../domain/entity/product.entity';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '@modules/categories/domain/entity/category.entity';

describe('ProductSearchUseCase', () => {
  let productSearchUseCase: ProductsSearchUseCase;
  let productsRepository: Repository<Product>;
  const mockCategory: Category = {
    id: uuidv4(),
    name: 'Mock Category',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  const mockProductList: Product[] = [
    {
      id: uuidv4(),
      name: 'Product 1',
      sku: 'SKU-001',
      description: 'A super product',
      price: {
        value: 100,
        currencyCode: 'USD',
      },
      category: mockCategory,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      id: uuidv4(),
      name: 'Product 2',
      sku: 'SKU-002',
      description: 'A super product 2.0',
      price: {
        value: 100,
        currencyCode: 'USD',
      },
      category: mockCategory,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

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

    productsRepository.find = jest.fn(async () => mockProductList);
    productsRepository.findBy = jest.fn(async () => mockProductList);
  });

  describe('searchProductsByKeyword', () => {
    it('should return products that match the keyword', async () => {
      const keyword = 'Product';

      const result = await productSearchUseCase.searchProductsByKeyword(
        keyword,
      );

      expect(productsRepository.find).toHaveBeenCalledWith({
        where: {
          name: keyword && Like(`%${keyword}%`),
        },
      });
      expect(result).toEqual(mockProductList);
    });

    it('should return an empty array if no products match the keyword', async () => {
      const keyword = 'example';
      const expectedProducts: Product[] = [];
      jest.spyOn(productsRepository, 'find').mockResolvedValue([]);

      const result = await productSearchUseCase.searchProductsByKeyword(
        keyword,
      );

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
      const criteria: Partial<Product> = {
        name: 'Product',
      };
      const filterOptions: FindOptionsWhere<Product> = {
        name: criteria.name && Like(`%${criteria.name}%`),
      };

      const result = await productSearchUseCase.filterProductsByCriteria(
        criteria,
      );

      expect(productsRepository.findBy).toHaveBeenCalledWith(filterOptions);
      expect(result).toEqual(mockProductList);
    });

    it('should return an empty array if no products meet the criteria', async () => {
      const criteria: Partial<Product> = {
        name: 'Product ABC',
      };

      const filterOptions: FindOptionsWhere<Product> = {
        name: criteria.name && Like(`%${criteria.name}%`),
      };

      const expectedProducts: Product[] = [];
      jest.spyOn(productsRepository, 'findBy').mockResolvedValue([]);

      const result = await productSearchUseCase.filterProductsByCriteria(
        criteria,
      );

      expect(productsRepository.findBy).toHaveBeenCalledWith(filterOptions);
      expect(result).toEqual(expectedProducts);
    });
  });
});

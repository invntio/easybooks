import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoriesUseCaseService } from './products-categories-usecase.service';
import { CategoriesUseCase } from '@modules/categories/application/usecases/categories.usecase';
import { Category } from '@modules/categories/domain/entity/category.entity';
import { v4 as uuidV4 } from 'uuid';
import { ProductCategoriesService } from './products-categories-service.abstract';

describe('ProductsService', () => {
  let productsCategoriesUseCaseService: ProductCategoriesService;
  let categoriesUseCase: CategoriesUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesUseCase,
        {
          provide: ProductCategoriesService,
          useClass: ProductCategoriesUseCaseService,
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    productsCategoriesUseCaseService = module.get<ProductCategoriesService>(
      ProductCategoriesService,
    );
    categoriesUseCase = module.get<CategoriesUseCase>(CategoriesUseCase);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  describe('getCategoryById', () => {
    it('should be defined', () => {
      expect(productsCategoriesUseCaseService.getCategoryById).toBeDefined();
    });

    it('should return category by its id if it exists', async () => {
      const mockCategory: Category = {
        id: uuidV4(),
        name: 'Mock Category',
        isActive: true,
        createdAt: new Date(),
      };

      jest
        .spyOn(categoriesUseCase, 'getCategoryById')
        .mockResolvedValue(mockCategory);

      const result = await productsCategoriesUseCaseService.getCategoryById(
        mockCategory.id,
      );

      expect(result).toEqual(mockCategory);
    });

    it('should return null if category with provided id does not exist', async () => {
      const mockCategory: Category = {
        id: uuidV4(),
        name: 'Mock Category',
        isActive: true,
        createdAt: new Date(),
      };

      jest.spyOn(categoriesUseCase, 'getCategoryById').mockResolvedValue(null);

      const result = await productsCategoriesUseCaseService.getCategoryById(
        mockCategory.id,
      );

      expect(result).toEqual(null);
    });
  });
});

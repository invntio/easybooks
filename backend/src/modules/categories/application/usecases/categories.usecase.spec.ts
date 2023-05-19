import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CategoriesUseCase } from './categories.usecase';
import { Category } from '../../domain/entity/category.entity';

describe('CategoriesUseCase', () => {
  let categoriesUseCase: CategoriesUseCase;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesUseCase,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    categoriesUseCase = module.get<CategoriesUseCase>(CategoriesUseCase);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return an array of categories', async () => {
      const expectedCategories: Category[] = [
        { id: '1', name: 'Category 1', isActive: true, createdAt: new Date() },
        { id: '2', name: 'Category 2', isActive: true, createdAt: new Date() },
      ];
      jest
        .spyOn(categoryRepository, 'find')
        .mockResolvedValue(expectedCategories);

      const result = await categoriesUseCase.getAllCategories();

      expect(result).toEqual(expectedCategories);
      expect(categoryRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category when given a valid id', async () => {
      const categoryId = '1';
      const expectedCategory: Category = {
        id: '1',
        name: 'Category 1',
        isActive: true,
        createdAt: new Date(),
      };
      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(expectedCategory);

      const result = await categoriesUseCase.getCategoryById(categoryId);

      expect(result).toEqual(expectedCategory);
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });

    it('should return null when given an invalid id', async () => {
      const categoryId = '999';
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      const result = await categoriesUseCase.getCategoryById(categoryId);

      expect(result).toBeNull();
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const categoryData: Partial<Category> = { name: 'New Category' };
      const createdCategory: Category = {
        id: '1',
        name: 'Category 1',
        isActive: true,
        createdAt: new Date(),
      };
      jest.spyOn(categoryRepository, 'create').mockReturnValue(createdCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(createdCategory);

      const result = await categoriesUseCase.createCategory(categoryData);

      expect(result).toEqual(createdCategory);
      expect(categoryRepository.create).toHaveBeenCalledTimes(1);
      expect(categoryRepository.create).toHaveBeenCalledWith(categoryData);
      expect(categoryRepository.save).toHaveBeenCalledTimes(1);
      expect(categoryRepository.save).toHaveBeenCalledWith(createdCategory);
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category when given a valid id and category data', async () => {
      const categoryId = '1';
      const categoryData: Partial<Category> = { name: 'Updated Category' };
      const existingCategory: Category = {
        id: '1',
        name: 'Old Category',
        isActive: true,
        createdAt: new Date(),
      };
      const updatedCategory: Category = {
        id: '1',
        name: 'Updated Category',
        isActive: true,
        createdAt: new Date(),
      };
      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(existingCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(updatedCategory);

      const result = await categoriesUseCase.updateCategory(
        categoryId,
        categoryData,
      );

      expect(result).toEqual(updatedCategory);
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(categoryRepository.save).toHaveBeenCalledTimes(1);
      expect(categoryRepository.save).toHaveBeenCalledWith(updatedCategory);
    });

    it('should return null when given an invalid id', async () => {
      const categoryId = '999';
      const categoryData: Partial<Category> = { name: 'Updated Category' };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(null);

      const result = await categoriesUseCase.updateCategory(
        categoryId,
        categoryData,
      );

      expect(result).toBeNull();
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(1);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(categoryRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should delete an existing category when given a valid id', async () => {
      const categoryId = '1';
      const deleteResult: DeleteResult | Promise<DeleteResult> = {
        affected: 1,
        raw: null,
      };
      jest.spyOn(categoryRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await categoriesUseCase.deleteCategory(categoryId);

      expect(result).toBe(true);
      expect(categoryRepository.delete).toHaveBeenCalledTimes(1);
      expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
    });

    it('should return false when given an invalid id', async () => {
      const categoryId = '999';
      const deleteResult: DeleteResult | Promise<DeleteResult> = {
        affected: 0,
        raw: null,
      };
      jest.spyOn(categoryRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await categoriesUseCase.deleteCategory(categoryId);

      expect(result).toBe(false);
      expect(categoryRepository.delete).toHaveBeenCalledTimes(1);
      expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
    });
  });
});

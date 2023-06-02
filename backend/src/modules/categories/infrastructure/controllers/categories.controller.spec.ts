import { Reflector } from '@nestjs/core';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../../application/services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../../domain/entity/category.entity';
import {
  ResponseMessageKey,
  ResponseMessageOptions,
} from '@common/decorators/response.decorator';
import { CATEGORIES_RESPONSES } from '../../common/categories.responses';
import { CategoryPresenter } from '../presenters/category.presenter';
import { CategoriesUseCase } from '@modules/categories/application/usecases/categories.usecase';
import { CategoriesSearchUseCase } from '@modules/categories/application/usecases/categories-search.usecase';
import {
  DeleteCategoryParams,
  FilterCategoryByCriteriaParams,
  SearchByKeywordParams,
  UpdateCategoryParams,
} from '../params/categories.params';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesSearchUseCase: CategoriesSearchUseCase;
  let categoriesUseCase: CategoriesUseCase;
  let categoriesService: CategoriesService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        CategoriesUseCase,
        CategoriesSearchUseCase,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    categoriesController =
      module.get<CategoriesController>(CategoriesController);
    categoriesUseCase = module.get<CategoriesUseCase>(CategoriesUseCase);
    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesSearchUseCase = module.get<CategoriesSearchUseCase>(
      CategoriesSearchUseCase,
    );
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(categoriesController.create).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          categoriesController.create,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: CATEGORIES_RESPONSES.CREATED,
      });
    });

    it('should create a category', async () => {
      const mockCategoryId = uuidV4();

      const createCategoryDto: CreateCategoryDto = {
        name: 'Category Name',
      };
      const expected: CategoryPresenter = {
        id: mockCategoryId,
        name: 'Category Name',
        isActive: true,
        createdAt: new Date(),
      };

      jest
        .spyOn(categoriesUseCase, 'createCategory')
        .mockResolvedValue(expected);
      jest.spyOn(categoriesService, 'checkIfExists').mockResolvedValue(false);

      const result = await categoriesController.create(createCategoryDto);

      expect(result).toEqual(expected);
      expect(categoriesUseCase.createCategory).toHaveBeenCalledWith(
        createCategoryDto,
      );
    });

    it('should return conflict exception if category already exists', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Category Name',
      };

      jest.spyOn(categoriesService, 'checkIfExists').mockResolvedValue(true);

      const result = categoriesController.create(createCategoryDto);

      await expect(result).rejects.toThrow();
    });

    it('should throw InternalServerErrorException when category creation fails', async () => {
      const createCategoryDto = { name: 'Category Name' };

      jest
        .spyOn(categoriesService, 'checkIfExists')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(categoriesUseCase, 'createCategory')
        .mockResolvedValueOnce(null);

      try {
        await categoriesController.create(createCategoryDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe(CATEGORIES_RESPONSES.NOT_CREATED);
      }
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(categoriesController.findAll).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          categoriesController.findAll,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: CATEGORIES_RESPONSES.FOUND_MANY,
      });
    });

    it('should return an array of categories', async () => {
      const mockCategoryId = uuidV4();

      const expected: Category[] = [
        {
          id: mockCategoryId,
          name: 'Category Name',
          isActive: true,
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(categoriesUseCase, 'getAllCategories')
        .mockResolvedValue(expected);

      const result = await categoriesController.findAll();

      expect(result).toEqual(expected);
      expect(categoriesUseCase.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(categoriesController.findOne).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          categoriesController.findOne,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: CATEGORIES_RESPONSES.FOUND_ONE,
      });
    });

    it('should return a category', async () => {
      const mockCategoryId1 = uuidV4();

      const expected: CategoryPresenter = {
        id: mockCategoryId1,
        name: 'Category Name',
        isActive: true,
        createdAt: new Date(),
      };
      jest
        .spyOn(categoriesUseCase, 'getCategoryById')
        .mockResolvedValue(expected);

      const result = await categoriesController.findOne({ id: '1' });

      expect(result).toEqual(expected);
      expect(categoriesUseCase.getCategoryById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when category is not found', async () => {
      const categoryId = '123';

      jest
        .spyOn(categoriesUseCase, 'getCategoryById')
        .mockResolvedValueOnce(null);

      try {
        await categoriesController.findOne({ id: categoryId });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(CATEGORIES_RESPONSES.NOT_FOUND_ONE);
      }
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(categoriesController.update).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          categoriesController.update,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: CATEGORIES_RESPONSES.UPDATED,
      });
    });

    it('should update a category', async () => {
      const oldCategory: Category = {
        id: uuidV4(),
        name: 'Old Category Name',
        isActive: true,
        createdAt: new Date(),
      };
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'New Category Name',
        isActive: false,
      };
      const newCategory: Category = Object.assign(
        oldCategory,
        updateCategoryDto,
      );

      const updateCategoryParams: UpdateCategoryParams = { id: oldCategory.id };

      jest
        .spyOn(categoriesUseCase, 'updateCategory')
        .mockResolvedValueOnce(newCategory);
      jest.spyOn(categoriesService, 'checkIfExists').mockResolvedValue(false);

      const result = await categoriesController.update(
        updateCategoryParams,
        updateCategoryDto,
      );

      expect(result).toEqual(newCategory);
      expect(categoriesUseCase.updateCategory).toHaveBeenCalledWith(
        updateCategoryParams.id,
        updateCategoryDto,
      );
    });

    it('should throw an error when the category does not exist', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'new name',
        isActive: false,
      };
      const categoryId = uuidV4();
      const updateCategoryParams: UpdateCategoryParams = { id: categoryId };

      jest
        .spyOn(categoriesUseCase, 'updateCategory')
        .mockResolvedValueOnce(null);
      jest.spyOn(categoriesService, 'checkIfExists').mockResolvedValue(false);

      const result = categoriesController.update(
        updateCategoryParams,
        updateCategoryDto,
      );

      await expect(result).rejects.toThrow();
    });

    it('should return conflict exception if category with desired name already exists', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Category Name',
      };
      const categoryId = uuidV4();
      const updateCategoryParams: UpdateCategoryParams = { id: categoryId };

      jest.spyOn(categoriesService, 'checkIfExists').mockResolvedValue(true);

      const result = categoriesController.update(
        updateCategoryParams,
        updateCategoryDto,
      );

      await expect(result).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(categoriesController.delete).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          categoriesController.delete,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: CATEGORIES_RESPONSES.DELETED,
      });
    });

    it('should delete a category', async () => {
      const categoryId = uuidV4();
      const deleteCategoryParams: DeleteCategoryParams = { id: categoryId };

      jest
        .spyOn(categoriesUseCase, 'deleteCategory')
        .mockResolvedValueOnce(true);

      const result = await categoriesController.delete(deleteCategoryParams);

      expect(result).toBeUndefined();
    });

    it('should throw an error when the category does not exist', async () => {
      const categoryId = uuidV4();
      const deleteCategoryParams: DeleteCategoryParams = { id: categoryId };

      jest
        .spyOn(categoriesUseCase, 'deleteCategory')
        .mockResolvedValueOnce(false);

      const result = categoriesController.delete(deleteCategoryParams);

      await expect(result).rejects.toThrow();
    });
  });

  describe('filter', () => {
    it('should be defined', () => {
      expect(categoriesController.filter).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          categoriesController.filter,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: CATEGORIES_RESPONSES.FOUND_MANY,
        emptyArrayMessage: CATEGORIES_RESPONSES.NOT_FOUND_MANY,
      });
    });

    it('should return an array of categories', async () => {
      const mockCriteria: FilterCategoryByCriteriaParams = {
        name: 'Category',
        isActive: true,
      };

      const mockFilteredCategories: Category[] = [
        {
          id: '1',
          name: 'Category 1',
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Category 2',
          isActive: true,
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(categoriesSearchUseCase, 'filterCategoriesByCriteria')
        .mockResolvedValue(mockFilteredCategories);

      const result = await categoriesController.filter(mockCriteria);

      expect(result).toEqual(mockFilteredCategories);
      expect(
        categoriesSearchUseCase.filterCategoriesByCriteria,
      ).toHaveBeenCalledWith({
        name: mockCriteria.name,
        isActive: mockCriteria.isActive,
      });
    });

    it('should return an empty array if no match is found', async () => {
      const mockCriteria: FilterCategoryByCriteriaParams = {
        name: 'Non-existing Category',
        isActive: true,
      };

      jest
        .spyOn(categoriesSearchUseCase, 'filterCategoriesByCriteria')
        .mockResolvedValue([]);

      const result = await categoriesController.filter(mockCriteria);

      expect(result).toEqual([]);
      expect(
        categoriesSearchUseCase.filterCategoriesByCriteria,
      ).toHaveBeenCalledWith({
        name: mockCriteria.name,
        isActive: mockCriteria.isActive,
      });
    });
  });

  describe('search', () => {
    it('should be defined', () => {
      expect(categoriesController.search).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          categoriesController.search,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: CATEGORIES_RESPONSES.FOUND_MANY,
        emptyArrayMessage: CATEGORIES_RESPONSES.NOT_FOUND_MANY,
      });
    });

    it('should return an array of categories', async () => {
      const mockKeyword: SearchByKeywordParams = {
        keyword: 'Category',
      };

      const mockSearchResult: Category[] = [
        {
          id: '1',
          name: 'Category 1',
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Category 2',
          isActive: true,
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(categoriesSearchUseCase, 'searchCategoriesByKeyword')
        .mockResolvedValue(mockSearchResult);

      const result = await categoriesController.search(mockKeyword);

      expect(result).toEqual(mockSearchResult);
      expect(
        categoriesSearchUseCase.searchCategoriesByKeyword,
      ).toHaveBeenCalledWith(mockKeyword.keyword);
    });

    it('should return an empty array if no match is found', async () => {
      const mockKeyword: SearchByKeywordParams = {
        keyword: 'Not matching category',
      };

      jest
        .spyOn(categoriesSearchUseCase, 'searchCategoriesByKeyword')
        .mockResolvedValue([]);

      const result = await categoriesController.search(mockKeyword);

      expect(result).toEqual([]);
      expect(
        categoriesSearchUseCase.searchCategoriesByKeyword,
      ).toHaveBeenCalledWith(mockKeyword.keyword);
    });
  });
});

/*
   GENERAL CONTROLLER REQUIREMENTS

   Each method should:
   * Be defined
   * Have a reply message
   * Return the type of data expected
   * Call the corresponding service

   If the method needs parameters/body it should:
   * Return error if it receives invalid inputs
   * Return error if it doesn't get the inputs it needs
*/

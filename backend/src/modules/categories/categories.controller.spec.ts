import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ResponseMessageKey } from '@common/decorators/response.decorator';
import {
  CATEGORY_CREATED,
  CATEGORY_DELETED,
  CATEGORY_FOUND_MANY,
  CATEGORY_FOUND_ONE,
  CATEGORY_UPDATED,
} from './utils/category-response.constants';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessage = reflector.get<string>(
        ResponseMessageKey,
        controller.create,
      );

      expect(responseMessage).toBeDefined();
      expect(responseMessage).toBe(CATEGORY_CREATED);
    });

    it('should create a category', async () => {
      const mockCategoryId1 = uuidV4();
      const mockCategoryId2 = uuidV4();

      const createCategoryDto: CreateCategoryDto = {
        name: 'Category Name',
        parentId: mockCategoryId2,
      };
      const expected: Category = {
        id: mockCategoryId1,
        name: 'Category Name',
        parentId: mockCategoryId2,
        subcategories: [],
        isActive: true,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'create').mockResolvedValue(expected);

      const result = await controller.create(createCategoryDto);

      expect(result).toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(controller.findAll).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessage = reflector.get<string>(
        ResponseMessageKey,
        controller.findAll,
      );

      expect(responseMessage).toBeDefined();
      expect(responseMessage).toBe(CATEGORY_FOUND_MANY);
    });

    it('should return an array of categories', async () => {
      const mockCategoryId = uuidV4();

      const expected: Category[] = [
        {
          id: mockCategoryId,
          name: 'Category Name',
          parentId: 'parent-id',
          subcategories: [],
          isActive: true,
          createdAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllWithSubcategories', () => {
    it('should be defined', () => {
      expect(controller.findAllWithSubcategories).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessage = reflector.get<string>(
        ResponseMessageKey,
        controller.findAllWithSubcategories,
      );

      expect(responseMessage).toBeDefined();
      expect(responseMessage).toBe(CATEGORY_FOUND_MANY);
    });

    it('should return an array of categories with subcategories', async () => {
      const mockCategoryId1 = uuidV4();
      const mockCategoryId2 = uuidV4();

      const expected: Category[] = [
        {
          id: mockCategoryId1,
          name: 'Category Name',
          parentId: null,
          subcategories: [
            {
              id: mockCategoryId2,
              name: 'Subcategory Name',
              parentId: mockCategoryId1,
              subcategories: [],
              isActive: true,
              createdAt: new Date(),
            },
          ],
          isActive: true,
          createdAt: new Date(),
        },
      ];
      jest
        .spyOn(service, 'findAllWithSubcategories')
        .mockResolvedValue(expected);

      const result = await controller.findAllWithSubcategories();

      expect(result).toEqual(expected);
      expect(service.findAllWithSubcategories).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(controller.findOne).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessage = reflector.get<string>(
        ResponseMessageKey,
        controller.findOne,
      );

      expect(responseMessage).toBeDefined();
      expect(responseMessage).toBe(CATEGORY_FOUND_ONE);
    });

    it('should return a category', async () => {
      const mockCategoryId1 = uuidV4();
      const mockCategoryId2 = uuidV4();

      const expected: Category = {
        id: mockCategoryId1,
        name: 'Category Name',
        parentId: mockCategoryId2,
        subcategories: [],
        isActive: true,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(expected);

      const result = await controller.findOne({ id: '1' });

      expect(result).toEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findOneWithSubcategories', () => {
    it('should be defined', () => {
      expect(controller.findOneWithSubcategories).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessage = reflector.get<string>(
        ResponseMessageKey,
        controller.findOneWithSubcategories,
      );

      expect(responseMessage).toBeDefined();
      expect(responseMessage).toBe(CATEGORY_FOUND_ONE);
    });

    it('should return a category with subcategories', async () => {
      const mockCategoryId1 = uuidV4();
      const mockCategoryId2 = uuidV4();

      const expected: Category = {
        id: mockCategoryId1,
        name: 'Category Name',
        parentId: 'parent-id',
        subcategories: [
          {
            id: mockCategoryId2,
            name: 'Subcategory Name',
            parentId: mockCategoryId1,
            subcategories: [],
            isActive: true,
            createdAt: new Date(),
          },
        ],
        isActive: true,
        createdAt: new Date(),
      };

      jest
        .spyOn(service, 'findOneWithSubcategories')
        .mockResolvedValue(expected);

      const result = await controller.findOneWithSubcategories({
        id: expected.id,
      });

      expect(result).toEqual(expected);
      expect(service.findOneWithSubcategories).toHaveBeenCalledWith(
        expected.id,
      );
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessage = reflector.get<string>(
        ResponseMessageKey,
        controller.update,
      );

      expect(responseMessage).toBeDefined();
      expect(responseMessage).toBe(CATEGORY_UPDATED);
    });

    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Category Name',
        parentId: uuidV4(),
        isActive: true,
      };
      const categoryId = uuidV4();

      jest.spyOn(service, 'update').mockResolvedValueOnce();

      const result = await controller.update(
        { id: categoryId },
        updateCategoryDto,
      );

      expect(result).toBeUndefined();
      expect(service.update).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
    });

    it('should throw an error when the category does not exist', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'new name',
        isActive: false,
      };
      const categoryId = uuidV4();

      jest.spyOn(service, 'update').mockImplementation((): any => {
        return Promise.reject(new Error('Category not found'));
      });

      expect(
        controller.update({ id: categoryId }, updateCategoryDto),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should be defined', () => {
      expect(controller.remove).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessage = reflector.get<string>(
        ResponseMessageKey,
        controller.remove,
      );

      expect(responseMessage).toBeDefined();
      expect(responseMessage).toBe(CATEGORY_DELETED);
    });

    it('should delete a category', async () => {
      const categoryId = uuidV4();

      jest.spyOn(service, 'remove').mockResolvedValueOnce();

      const result = await controller.remove({ id: categoryId });

      expect(result).toBeUndefined();
    });

    it('should throw an error when the category does not exist', async () => {
      const categoryId = 'non-existent-category';

      jest.spyOn(service, 'remove').mockImplementation((): any => {
        return Promise.reject(new Error('Category not found'));
      });

      expect(controller.remove({ id: categoryId })).rejects.toThrow();
    });
  });
});

/*
  REQUISITOS GENERALES DEL CONTROLADOR

  Cada metodo deberia:
  * Estar definido
  * Tener un mensaje de respuesta
  * Devolver el tipo de dato que se espera
  * Llamar a su servicio correspondiente

  Si el metodo necesita parametros/body deberia:
  * Devolver error si recibe entradas invalidas
  * Devolver error si no recibe las entradas que necesita
*/

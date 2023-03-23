import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { Repository, TypeORMError } from 'typeorm';
import {
  CATEGORY_ALREADY_EXISTS,
  CATEGORY_NOT_FOUND_ONE,
  CATEGORY_PARENT_NOT_EXIST,
} from './utils/category-response.constants';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { v4 as uuidV4 } from 'uuid';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoriesRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Category],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Category]),
      ],
      providers: [CategoriesService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  afterEach(async () => {
    categoriesRepository.clear();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Category 1',
        parentId: null,
      };

      const category = await service.create(createCategoryDto);

      expect(category).toBeDefined();
      expect(category.name).toEqual(createCategoryDto.name);
      expect(category.parentId).toEqual(createCategoryDto.parentId);
    });

    it('should create a new category with parent', async () => {
      const createCategoryDto1: CreateCategoryDto = {
        name: 'Category 1',
      };

      const category1 = await service.create(createCategoryDto1);

      const createCategoryDto2: CreateCategoryDto = {
        name: 'Category 2',
        parentId: category1.id,
      };

      const category2 = await service.create(createCategoryDto2);

      expect(category2).toBeDefined();
      expect(category2.name).toEqual(category2.name);
      expect(category2.parentId).toEqual(category2.parentId);
    });

    it('should throw a TypeORMError if a category with the same name already exists', async () => {
      const createCategoryDto1: CreateCategoryDto = {
        name: 'Category 1',
      };

      const createCategoryDto2: CreateCategoryDto = {
        name: 'Category 1',
      };

      await service.create(createCategoryDto1);
      const result2 = service.create(createCategoryDto2);

      await expect(result2).rejects.toThrow(TypeORMError);
      await expect(result2).rejects.toThrow(CATEGORY_ALREADY_EXISTS);
    });

    it('should throw a TypeORMError if the parent does not exist', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Category 1',
        parentId: 'e60ce7e7-cd70-4cf9-a2f9-7e078d546b94',
      };

      const result = service.create(createCategoryDto);

      await expect(result).rejects.toThrow(TypeORMError);
      await expect(result).rejects.toThrow(CATEGORY_PARENT_NOT_EXIST);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });

    it('should return an array of categories', async () => {
      const category1: CreateCategoryDto = {
        name: 'Test Category 1',
      };
      const category2 = {
        name: 'Test Category 2',
      };

      await service.create(category1);
      await service.create(category2);

      const result = await service.findAll();

      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('findAllWithSubcategories', () => {
    it('should be defined', () => {
      expect(service.findAllWithSubcategories).toBeDefined();
    });

    it('should return an array of categories with subcategories', async () => {
      const category1: CreateCategoryDto = {
        name: 'Test Category 1',
      };

      const createdCategory1 = await service.create(category1);

      const category2: CreateCategoryDto = {
        name: 'Test Category 2',
        parentId: createdCategory1.id,
      };

      await service.create(category2);

      const result = await service.findAllWithSubcategories();

      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].subcategories).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(service.findOne).toBeDefined();
    });

    it('should return a category by ID', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      const createdCategory = await service.create(createCategoryDto);
      const result = await service.findOne(createdCategory.id);
      expect(result.name).toEqual(createdCategory.name);
    });

    it('should return an TypeORMError if category not found', async () => {
      const idToSearch = uuidV4();

      const result = service.findOne(idToSearch);

      expect(result).rejects.toThrow(TypeORMError);
      expect(result).rejects.toThrow(CATEGORY_NOT_FOUND_ONE);
    });
  });

  describe('findOneWithSubcategories', () => {
    it('should be defined', () => {
      expect(service.findOneWithSubcategories).toBeDefined();
    });

    it('should return a category with subcategories', async () => {
      const category1: CreateCategoryDto = {
        name: 'Test Category 1',
      };

      const createdCategory1 = await service.create(category1);

      const category2: CreateCategoryDto = {
        name: 'Test Category 2',
        parentId: createdCategory1.id,
      };

      const createdCategory2 = await service.create(category2);

      const result = await service.findOneWithSubcategories(
        createdCategory1.id,
      );

      expect(result.name).toEqual(category1.name);
      expect(result.subcategories).toBeDefined();
      expect(result.subcategories).toContainEqual(createdCategory2);
    });

    it('should return an TypeORMError if category not found', async () => {
      const idToSearch = uuidV4();

      const result = service.findOneWithSubcategories(idToSearch);

      await expect(result).rejects.toThrow(TypeORMError);
      await expect(result).rejects.toThrow(CATEGORY_NOT_FOUND_ONE);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should update a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      const createdCategory = await service.create(createCategoryDto);

      const newCategory: UpdateCategoryDto = {
        name: 'Updated Category',
      };
      const result = await service.update(createdCategory.id, newCategory);
      const updatedCategory = await service.findOne(createdCategory.id);

      expect(result).toBeUndefined();
      expect(updatedCategory.name).toEqual(newCategory.name);
    });

    it('should return an TypeORMError if category not found', async () => {
      const updatedCategory: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      const idToSearch = uuidV4();

      const result = service.update(idToSearch, updatedCategory);

      expect(result).rejects.toThrow(TypeORMError);
      expect(result).rejects.toThrow(CATEGORY_NOT_FOUND_ONE);
    });

    it('should throw a TypeORMError if parent does not exist', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      const createdCategory = await service.create(createCategoryDto);

      const newCategory: UpdateCategoryDto = {
        name: 'Updated Category',
        parentId: 'e60ce7e7-cd70-4cf9-a2f9-7e078d546b94',
      };
      const result = service.update(createdCategory.id, newCategory);

      await expect(result).rejects.toThrow(TypeORMError);
      await expect(result).rejects.toThrow(CATEGORY_PARENT_NOT_EXIST);
    });
  });

  describe('remove', () => {
    it('should be defined', () => {
      expect(service.remove).toBeDefined();
    });

    it('should remove a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      const createdCategory = await service.create(createCategoryDto);

      const result = await service.remove(createdCategory.id);

      expect(result).toBeUndefined();
    });

    it('should return an TypeORMError if category not found', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };
      await service.create(createCategoryDto);

      const idToSearch = uuidV4();

      const result = service.remove(idToSearch);

      await expect(result).rejects.toThrow(TypeORMError);
      await expect(result).rejects.toThrow(CATEGORY_NOT_FOUND_ONE);
    });
  });
});

/*
  REQUISITOS GENERALES DEL SERVICIO

  Cada metodo deberia:
  * Estar definido
  * Devolver el tipo de dato que se espera
  * Llamar a su servicio correspondiente

  Si el metodo necesita parametros/body deberia:
  * Devolver error si recibe entradas invalidas
  * Devolver error si no recibe las entradas que necesita
  
  Si el metodo realiza una busqueda
  * Devolver error si no se encuentran coincidencias
  
*/

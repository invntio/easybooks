import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from '../../domain/entity/category.entity';
import { Repository, TypeORMError } from 'typeorm';
import { CATEGORY_RESPONSES } from '../../common/categories.responses';
import { CreateCategoryDto } from '../../infrastructure/dto/create-category.dto';
import { UpdateCategoryDto } from '../../infrastructure/dto/update-category.dto';
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
      };

      const category = await service.create(createCategoryDto);

      expect(category).toBeDefined();
      expect(category.name).toEqual(createCategoryDto.name);
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
      await expect(result2).rejects.toThrow(CATEGORY_RESPONSES.ALREADY_EXISTS);
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
      expect(result).rejects.toThrow(CATEGORY_RESPONSES.NOT_FOUND_ONE);
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
      expect(result).rejects.toThrow(CATEGORY_RESPONSES.NOT_FOUND_ONE);
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
      await expect(result).rejects.toThrow(CATEGORY_RESPONSES.NOT_FOUND_ONE);
    });
  });
});

/*
   GENERAL SERVICE REQUIREMENTS

   Each method should:
   * Be defined
   * Return the type of data expected
   * Do the expected function

   If the method needs parameters/body it should:
   * Return error if it receives invalid inputs
   * Return error if you don't get the inputs you need
  
   If the method performs a search
   * Return error if no matches found
*/

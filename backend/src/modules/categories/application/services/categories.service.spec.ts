import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from '../../domain/entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../../infrastructure/dto/create-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoriesRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  describe('checkIfExists', () => {
    it('should be defined', () => {
      expect(service.checkIfExists).toBeDefined();
    });

    it('should return true if category exists', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Category 1',
      };

      jest.spyOn(categoriesRepository, 'exist').mockResolvedValue(true);

      const result = await service.checkIfExists({
        name: createCategoryDto.name,
      });

      expect(result).toEqual(true);
    });

    it('should return false if category not exists', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Category 1',
      };

      jest.spyOn(categoriesRepository, 'exist').mockResolvedValue(false);

      const result = await service.checkIfExists({
        name: createCategoryDto.name,
      });

      expect(result).toEqual(false);
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
   * Return error if doesn't get the inputs it needs
  
   If the method performs a search
   * Return error if no matches found
*/

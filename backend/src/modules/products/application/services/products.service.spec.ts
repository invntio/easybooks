import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from '../../domain/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../../infrastructure/dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  describe('checkIfExists', () => {
    it('should be defined', () => {
      expect(service.checkIfExists).toBeDefined();
    });

    it('should return true if product exists', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
      };

      jest.spyOn(productsRepository, 'exist').mockResolvedValue(true);

      const result = await service.checkIfExists({
        name: createProductDto.name,
      });

      expect(result).toEqual(true);
    });

    it('should return false if product not exists', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
      };

      jest.spyOn(productsRepository, 'exist').mockResolvedValue(false);

      const result = await service.checkIfExists({
        name: createProductDto.name,
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

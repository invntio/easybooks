import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProductsUseCase } from './products.usecase';
import { Product } from '../../domain/entity/product.entity';

describe('ProductsUseCase', () => {
  let productsUseCase: ProductsUseCase;
  let productsRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsUseCase,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    productsUseCase = module.get<ProductsUseCase>(ProductsUseCase);
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const expectedProducts: Product[] = [
        { id: '1', name: 'Product 1', createdAt: new Date() },
        { id: '2', name: 'Product 2', createdAt: new Date() },
      ];
      jest
        .spyOn(productsRepository, 'find')
        .mockResolvedValue(expectedProducts);

      const result = await productsUseCase.getAllProducts();

      expect(result).toEqual(expectedProducts);
      expect(productsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    it('should return a product when given a valid id', async () => {
      const productId = '1';
      const expectedProduct: Product = {
        id: '1',
        name: 'Product 1',
        isActive: true,
        createdAt: new Date(),
      };
      jest
        .spyOn(productsRepository, 'findOne')
        .mockResolvedValue(expectedProduct);

      const result = await productsUseCase.getProductById(productId);

      expect(result).toEqual(expectedProduct);
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });

    it('should return null when given an invalid id', async () => {
      const productId = '999';
      jest.spyOn(productsRepository, 'findOne').mockResolvedValue(null);

      const result = await productsUseCase.getProductById(productId);

      expect(result).toBeNull();
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData: Partial<Product> = { name: 'New Product' };
      const createdProduct: Product = {
        id: '1',
        name: 'Product 1',
        isActive: true,
        createdAt: new Date(),
      };
      jest.spyOn(productsRepository, 'create').mockReturnValue(createdProduct);
      jest.spyOn(productsRepository, 'save').mockResolvedValue(createdProduct);

      const result = await productsUseCase.createProduct(productData);

      expect(result).toEqual(createdProduct);
      expect(productsRepository.create).toHaveBeenCalledTimes(1);
      expect(productsRepository.create).toHaveBeenCalledWith(productData);
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
      expect(productsRepository.save).toHaveBeenCalledWith(createdProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product when given a valid id and product data', async () => {
      const productId = '1';
      const productData: Partial<Product> = { name: 'Updated Product' };
      const existingProduct: Product = {
        id: '1',
        name: 'Old Product',
        isActive: true,
        createdAt: new Date(),
      };
      const updatedProduct: Product = Object.assign(existingProduct, {
        name: 'Updated Product',
      });

      jest
        .spyOn(productsRepository, 'findOne')
        .mockResolvedValue(existingProduct);
      jest.spyOn(productsRepository, 'save').mockResolvedValue(updatedProduct);

      const result = await productsUseCase.updateProduct(
        productId,
        productData,
      );

      expect(result).toEqual(updatedProduct);
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
      expect(productsRepository.save).toHaveBeenCalledWith(updatedProduct);
    });

    it('should return null when given an invalid id', async () => {
      const productId = '999';
      const productData: Partial<Product> = { name: 'Updated Product' };
      jest.spyOn(productsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(productsRepository, 'save').mockResolvedValue(null);

      const result = await productsUseCase.updateProduct(
        productId,
        productData,
      );

      expect(result).toBeNull();
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(productsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product when given a valid id', async () => {
      const productId = '1';
      const deleteResult: DeleteResult | Promise<DeleteResult> = {
        affected: 1,
        raw: null,
      };
      jest.spyOn(productsRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await productsUseCase.deleteProduct(productId);

      expect(result).toBe(true);
      expect(productsRepository.delete).toHaveBeenCalledTimes(1);
      expect(productsRepository.delete).toHaveBeenCalledWith(productId);
    });

    it('should return false when given an invalid id', async () => {
      const productId = '999';
      const deleteResult: DeleteResult | Promise<DeleteResult> = {
        affected: 0,
        raw: null,
      };
      jest.spyOn(productsRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await productsUseCase.deleteProduct(productId);

      expect(result).toBe(false);
      expect(productsRepository.delete).toHaveBeenCalledTimes(1);
      expect(productsRepository.delete).toHaveBeenCalledWith(productId);
    });
  });
});

/*
   GENERAL USECASE REQUIREMENTS

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

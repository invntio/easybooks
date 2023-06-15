import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProductsUseCase } from './products.usecase';
import { Product } from '../../domain/entity/product.entity';
import { Category } from '@modules/categories/domain/entity/category.entity';
import { v4 as uuidv4 } from 'uuid';

describe('ProductsUseCase', () => {
  let productsUseCase: ProductsUseCase;
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

    productsRepository.find = jest.fn(async () => mockProductList);
    productsRepository.findBy = jest.fn(async () => mockProductList);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const result = await productsUseCase.getAllProducts();

      expect(result).toEqual(mockProductList);
      expect(productsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    it('should return a product when given a valid id', async () => {
      const mockCategory: Category = {
        id: uuidv4(),
        name: 'Mock Category',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const mockProductId = uuidv4();
      const mockProductList: Product = {
        id: mockProductId,
        name: 'Product Name',
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
      };
      jest
        .spyOn(productsRepository, 'findOne')
        .mockResolvedValue(mockProductList);

      const result = await productsUseCase.getProductById(mockProductId);

      expect(result).toEqual(mockProductList);
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        relations: ['category'],
        where: { id: mockProductId },
      });
    });

    it('should return null when given an invalid id', async () => {
      const productId = '999';
      jest.spyOn(productsRepository, 'findOne').mockResolvedValue(null);

      const result = await productsUseCase.getProductById(productId);

      expect(result).toBeNull();
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        relations: ['category'],
        where: { id: productId },
      });
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const mockCategory: Category = {
        id: uuidv4(),
        name: 'Mock Category',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const mockProductId = uuidv4();
      const productData: Partial<Product> = {
        id: mockProductId,
        name: 'Product Name',
        sku: 'SKU-001',
        description: 'A super product',
        price: {
          value: 100,
          currencyCode: 'USD',
        },
        category: mockCategory,
      };
      const createdProduct: Product = {
        id: mockProductId,
        name: 'Product Name',
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
      const updateProductData: Partial<Product> = { name: 'Updated Product' };
      const mockCategory: Category = {
        id: uuidv4(),
        name: 'Mock Category',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const existingProduct: Product = {
        id: uuidv4(),
        name: 'Product Name',
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
        updateProductData,
      );

      expect(result).toEqual(updatedProduct);
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        relations: ['category'],
        where: { id: productId },
      });
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
      expect(productsRepository.save).toHaveBeenCalledWith(updatedProduct);
    });

    it('should return null when given an invalid id', async () => {
      const productId = '999';
      const updateProductData: Partial<Product> = { name: 'Updated Product' };
      jest.spyOn(productsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(productsRepository, 'save').mockResolvedValue(null);

      const result = await productsUseCase.updateProduct(
        productId,
        updateProductData,
      );

      expect(result).toBeNull();
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productsRepository.findOne).toHaveBeenCalledWith({
        relations: ['category'],
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

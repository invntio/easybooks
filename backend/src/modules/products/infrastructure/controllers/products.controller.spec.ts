import { Reflector } from '@nestjs/core';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { v4 as uuidV4 } from 'uuid';
import { ProductsController } from './products.controller';
import { ProductsService } from '../../application/services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  ResponseMessageKey,
  ResponseMessageOptions,
} from '@common/decorators/response.decorator';
import { PRODUCTS_RESPONSES } from '../../common/products.responses';
import { ProductPresenter } from '../presenters/product.presenter';
import { ProductsUseCase } from '@modules/products/application/usecases/products.usecase';
import { ProductsSearchUseCase } from '@modules/products/application/usecases/products-search.usecase';
import {
  DeleteProductParams,
  FilterProductByCriteriaParams,
  SearchProductByKeywordParams,
} from '../params/products.params';
import { ProductCategoriesService } from '@modules/products/application/services/products-categories-service.abstract';
import { ProductsModule } from '@modules/products/products.module';
import { Category } from '@modules/categories/domain/entity/category.entity';
import { mockProductList } from '@modules/products/domain/mocks/product.mock';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsSearchUseCase: ProductsSearchUseCase;
  let productsUseCase: ProductsUseCase;
  let productsService: ProductsService;
  let productCategoriesService: ProductCategoriesService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        }),
        ProductsModule,
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsUseCase = module.get<ProductsUseCase>(ProductsUseCase);
    productsService = module.get<ProductsService>(ProductsService);
    productCategoriesService = module.get<ProductCategoriesService>(
      ProductCategoriesService,
    );
    productsSearchUseCase = module.get<ProductsSearchUseCase>(
      ProductsSearchUseCase,
    );
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(productsController.create).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          productsController.create,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: PRODUCTS_RESPONSES.CREATED,
      });
    });

    it('should create a product', async () => {
      const mockProductId = uuidV4();

      const mockCategory: Category = {
        id: uuidV4(),
        name: 'Mock Category',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const createProductDto: CreateProductDto = {
        name: 'Product Name',
        price: {
          value: 100,
          currencyCode: 'USD',
        },
        categoryId: mockCategory.id,
        sku: 'SKU-001',
        description: 'Short description',
      };
      const expected: ProductPresenter = {
        id: mockProductId,
        name: 'Product Name',
        sku: 'SKU-001',
        description: 'A super laptop',
        price: {
          value: 100,
          currencyCode: 'USD',
        },
        category: mockCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(productsUseCase, 'createProduct').mockResolvedValue(expected);
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(false);
      jest
        .spyOn(productCategoriesService, 'getCategoryById')
        .mockResolvedValue(mockCategory);

      const result = await productsController.create(createProductDto);

      expect(result).toEqual(expected);
    });

    it('should throw a ConflictException if the product name already exists', async () => {
      // Mock de los datos de entrada
      const createProductDto = {
        name: 'Laptop',
        sku: 'SKU-001',
        description: 'A super laptop',
        categoryId: 'f313b4ac-7c7b-48d3-8ca3-208a2c770324',
        price: { value: 100, currencyCode: 'USD' },
      };

      // Mock de checkIfExists para que retorne verdadero cuando se verifica el nombre
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(true);

      await expect(productsController.create(createProductDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a ConflictException if the product SKU already exists', async () => {
      // Mock de los datos de entrada
      const createProductDto = {
        name: 'Laptop',
        sku: 'SKU-001',
        description: 'A super laptop',
        categoryId: 'f313b4ac-7c7b-48d3-8ca3-208a2c770324',
        price: { value: 100, currencyCode: 'USD' },
      };

      // Mock de checkIfExists para que retorne verdadero cuando se verifica el SKU
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValueOnce(false);
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(true);

      await expect(productsController.create(createProductDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a BadRequestException if the product category does not exist', async () => {
      // Mock de los datos de entrada
      const createProductDto = {
        name: 'Laptop',
        sku: 'SKU-001',
        description: 'A super laptop',
        categoryId: 'f313b4ac-7c7b-48d3-8ca3-208a2c770324',
        price: { value: 100, currencyCode: 'USD' },
      };

      // Mock de getCategoryById para que retorne null
      jest
        .spyOn(productCategoriesService, 'getCategoryById')
        .mockResolvedValue(null);

      await expect(productsController.create(createProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a InternalServerErrorException if product creation fails', async () => {
      const mockCategory: Category = {
        id: uuidV4(),
        name: 'Mock Category',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const createProductDto: CreateProductDto = {
        name: 'Product Name',
        price: {
          value: 100,
          currencyCode: 'USD',
        },
        categoryId: mockCategory.id,
        sku: 'SKU-001',
        description: 'Short description',
      };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(false);
      jest
        .spyOn(productCategoriesService, 'getCategoryById')
        .mockResolvedValue(mockCategory);

      jest.spyOn(productsUseCase, 'createProduct').mockResolvedValue(null);

      await expect(productsController.create(createProductDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(productsController.findAll).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          productsController.findAll,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: PRODUCTS_RESPONSES.FOUND_MANY,
      });
    });

    it('should return an array of products', async () => {
      jest
        .spyOn(productsUseCase, 'getAllProducts')
        .mockResolvedValue(mockProductList);

      const result = await productsController.findAll();

      expect(result).toEqual(mockProductList);
      expect(productsUseCase.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(productsController.findOne).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          productsController.findOne,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: PRODUCTS_RESPONSES.FOUND_ONE,
      });
    });

    it('should return a product', async () => {
      const mockProductId1 = uuidV4();

      const expected: ProductPresenter = {
        id: mockProductId1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        name: 'Product 2',
        sku: 'SKU-002',
        description: 'A super product 2.0',
        price: {
          value: 100,
          currencyCode: 'USD',
        },
        category: {
          id: 'e6aa8568-b090-4912-87dc-5f3ce5e2e867',
          name: 'Electronics',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      };
      jest.spyOn(productsUseCase, 'getProductById').mockResolvedValue(expected);

      const result = await productsController.findOne({ id: '1' });

      expect(result).toEqual(expected);
      expect(productsUseCase.getProductById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product is not found', async () => {
      const productId = '123';

      jest.spyOn(productsUseCase, 'getProductById').mockResolvedValueOnce(null);

      try {
        await productsController.findOne({ id: productId });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(PRODUCTS_RESPONSES.NOT_FOUND_ONE);
      }
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(productsController.update).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          productsController.update,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: PRODUCTS_RESPONSES.UPDATED,
      });
    });

    it('should update a product', async () => {
      const mockProductId = uuidV4();

      const mockCategory: Category = {
        id: uuidV4(),
        name: 'Mock Category',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product Name',
        price: {
          value: 200,
          currencyCode: 'USD',
        },
        categoryId: mockCategory.id,
        sku: 'SKU-002',
        description: 'Updated description',
      };

      const expected: ProductPresenter = {
        id: mockProductId,
        name: 'Updated Product Name',
        sku: 'SKU-002',
        description: 'Updated description',
        price: {
          value: 200,
          currencyCode: 'USD',
        },
        category: mockCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValueOnce(true);
      jest.spyOn(productsUseCase, 'updateProduct').mockResolvedValue(expected);
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(false);
      jest
        .spyOn(productCategoriesService, 'getCategoryById')
        .mockResolvedValue(mockCategory);

      const result = await productsController.update(
        { id: 'product-id' },
        updateProductDto,
      );

      expect(result).toEqual(expected);
    });

    it('should throw a ConflictException if the updated product name already exists', async () => {
      const updateProductDto = {
        name: 'Laptop',
      };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValueOnce(true);
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(true);

      await expect(
        productsController.update({ id: 'product-id' }, updateProductDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw a ConflictException if the updated product SKU already exists', async () => {
      const updateProductDto = {
        sku: 'SKU-001',
      };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValueOnce(true);
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(true);

      await expect(
        productsController.update({ id: 'product-id' }, updateProductDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw a BadRequestException if the updated product category does not exist', async () => {
      const mockProductId = uuidV4();
      const updateProductDto = {
        categoryId: uuidV4(),
      };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValueOnce(true);
      jest
        .spyOn(productCategoriesService, 'getCategoryById')
        .mockResolvedValue(null);

      await expect(
        productsController.update({ id: mockProductId }, updateProductDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a NotFoundException if the product to update is not found', async () => {
      const mockProductId = uuidV4();
      const updateProductDto = {
        name: 'Updated name',
      };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(false);

      await expect(
        productsController.update({ id: mockProductId }, updateProductDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a InternalServerErrorException if product update fails', async () => {
      const mockProductId = uuidV4();
      const updateProductDto = {
        name: 'Updated name',
      };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValueOnce(true);
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValueOnce(false);
      jest.spyOn(productsUseCase, 'updateProduct').mockResolvedValueOnce(null);

      await expect(
        productsController.update({ id: mockProductId }, updateProductDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(productsController.delete).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          productsController.delete,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: PRODUCTS_RESPONSES.DELETED,
      });
    });

    it('should delete a product', async () => {
      const productId = uuidV4();
      const deleteProductParams: DeleteProductParams = { id: productId };

      jest.spyOn(productsUseCase, 'deleteProduct').mockResolvedValueOnce(true);

      const result = await productsController.delete(deleteProductParams);

      expect(result).toBeUndefined();
    });

    it('should throw an error when the product does not exist', async () => {
      const productId = uuidV4();
      const deleteProductParams: DeleteProductParams = { id: productId };

      jest.spyOn(productsUseCase, 'deleteProduct').mockResolvedValueOnce(false);

      const result = productsController.delete(deleteProductParams);

      await expect(result).rejects.toThrow();
    });
  });

  describe('filter', () => {
    it('should be defined', () => {
      expect(productsController.filter).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          productsController.filter,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: PRODUCTS_RESPONSES.FOUND_MANY,
        emptyArrayMessage: PRODUCTS_RESPONSES.NOT_FOUND_MANY,
      });
    });

    it('should return an array of products', async () => {
      const mockCriteria: FilterProductByCriteriaParams = {
        name: 'Product',
      };

      jest
        .spyOn(productsSearchUseCase, 'filterProductsByCriteria')
        .mockResolvedValue(mockProductList);

      const result = await productsController.filter(mockCriteria);

      expect(result).toEqual(mockProductList);
      expect(
        productsSearchUseCase.filterProductsByCriteria,
      ).toHaveBeenCalledWith({
        name: mockCriteria.name,
      });
    });

    it('should return an empty array if no match is found', async () => {
      const mockCriteria: FilterProductByCriteriaParams = {
        name: 'Non-existing Product',
      };

      jest
        .spyOn(productsSearchUseCase, 'filterProductsByCriteria')
        .mockResolvedValue([]);

      const result = await productsController.filter(mockCriteria);

      expect(result).toEqual([]);
      expect(
        productsSearchUseCase.filterProductsByCriteria,
      ).toHaveBeenCalledWith({
        name: mockCriteria.name,
      });
    });
  });

  describe('search', () => {
    it('should be defined', () => {
      expect(productsController.search).toBeDefined();
    });

    it('should have the corresponding response message', () => {
      const responseMessageOptions: ResponseMessageOptions =
        reflector.get<ResponseMessageOptions>(
          ResponseMessageKey,
          productsController.search,
        );

      expect(responseMessageOptions).toBeDefined();
      expect(responseMessageOptions).toEqual({
        okMessage: PRODUCTS_RESPONSES.FOUND_MANY,
        emptyArrayMessage: PRODUCTS_RESPONSES.NOT_FOUND_MANY,
      });
    });

    it('should return an array of products', async () => {
      const mockKeyword: SearchProductByKeywordParams = {
        keyword: 'Product',
      };

      jest
        .spyOn(productsSearchUseCase, 'searchProductsByKeyword')
        .mockResolvedValue(mockProductList);

      const result = await productsController.search(mockKeyword);

      expect(result).toEqual(mockProductList);
      expect(
        productsSearchUseCase.searchProductsByKeyword,
      ).toHaveBeenCalledWith(mockKeyword.keyword);
    });

    it('should return an empty array if no match is found', async () => {
      const mockKeyword: SearchProductByKeywordParams = {
        keyword: 'Not matching product',
      };

      jest
        .spyOn(productsSearchUseCase, 'searchProductsByKeyword')
        .mockResolvedValue([]);

      const result = await productsController.search(mockKeyword);

      expect(result).toEqual([]);
      expect(
        productsSearchUseCase.searchProductsByKeyword,
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

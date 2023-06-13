import { Reflector } from '@nestjs/core';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { ProductsController } from './products.controller';
import { ProductsService } from '../../application/services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../../domain/entity/product.entity';
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
  UpdateProductParams,
} from '../params/products.params';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsSearchUseCase: ProductsSearchUseCase;
  let productsUseCase: ProductsUseCase;
  let productsService: ProductsService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        ProductsUseCase,
        ProductsSearchUseCase,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsUseCase = module.get<ProductsUseCase>(ProductsUseCase);
    productsService = module.get<ProductsService>(ProductsService);
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

      const createProductDto: CreateProductDto = {
        name: 'Product Name',
      };
      const expected: ProductPresenter = {
        id: mockProductId,
        name: 'Product Name',
        createdAt: new Date(),
      };

      jest.spyOn(productsUseCase, 'createProduct').mockResolvedValue(expected);
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(false);

      const result = await productsController.create(createProductDto);

      expect(result).toEqual(expected);
      expect(productsUseCase.createProduct).toHaveBeenCalledWith(
        createProductDto,
      );
    });

    it('should return conflict exception if product already exists', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product Name',
      };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(true);

      const result = productsController.create(createProductDto);

      await expect(result).rejects.toThrow();
    });

    it('should throw InternalServerErrorException when product creation fails', async () => {
      const createProductDto = { name: 'Product Name' };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValueOnce(false);
      jest.spyOn(productsUseCase, 'createProduct').mockResolvedValueOnce(null);

      try {
        await productsController.create(createProductDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe(PRODUCTS_RESPONSES.NOT_CREATED);
      }
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
      const mockProductId = uuidV4();

      const expected: Product[] = [
        {
          id: mockProductId,
          name: 'Product Name',
          createdAt: new Date(),
        },
      ];
      jest.spyOn(productsUseCase, 'getAllProducts').mockResolvedValue(expected);

      const result = await productsController.findAll();

      expect(result).toEqual(expected);
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
        name: 'Product Name',
        createdAt: new Date(),
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
      const oldProduct: Product = {
        id: uuidV4(),
        name: 'Old Product Name',
        createdAt: new Date(),
      };
      const updateProductDto: UpdateProductDto = {
        name: 'New Product Name',
      };
      const newProduct: Product = Object.assign(oldProduct, updateProductDto);

      const updateProductParams: UpdateProductParams = { id: oldProduct.id };

      jest
        .spyOn(productsUseCase, 'updateProduct')
        .mockResolvedValueOnce(newProduct);
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(false);

      const result = await productsController.update(
        updateProductParams,
        updateProductDto,
      );

      expect(result).toEqual(newProduct);
      expect(productsUseCase.updateProduct).toHaveBeenCalledWith(
        updateProductParams.id,
        updateProductDto,
      );
    });

    it('should throw an error when the product does not exist', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'new name',
      };
      const productId = uuidV4();
      const updateProductParams: UpdateProductParams = { id: productId };

      jest.spyOn(productsUseCase, 'updateProduct').mockResolvedValueOnce(null);
      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(false);

      const result = productsController.update(
        updateProductParams,
        updateProductDto,
      );

      await expect(result).rejects.toThrow();
    });

    it('should return conflict exception if product with desired name already exists', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Product Name',
      };
      const productId = uuidV4();
      const updateProductParams: UpdateProductParams = { id: productId };

      jest.spyOn(productsService, 'checkIfExists').mockResolvedValue(true);

      const result = productsController.update(
        updateProductParams,
        updateProductDto,
      );

      await expect(result).rejects.toThrow();
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

      const mockFilteredProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Product 2',
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(productsSearchUseCase, 'filterProductsByCriteria')
        .mockResolvedValue(mockFilteredProducts);

      const result = await productsController.filter(mockCriteria);

      expect(result).toEqual(mockFilteredProducts);
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

      const mockSearchResult: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Product 2',
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(productsSearchUseCase, 'searchProductsByKeyword')
        .mockResolvedValue(mockSearchResult);

      const result = await productsController.search(mockKeyword);

      expect(result).toEqual(mockSearchResult);
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

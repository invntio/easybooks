import { ResponseMessage } from '@common/decorators/response.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from '../../application/services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  DeleteProductParams,
  FilterProductByCriteriaParams,
  FindOneProductParams,
  SearchProductByKeywordParams,
  UpdateProductParams,
} from '../params/products.params';
import { PRODUCTS_RESPONSES } from '../../common/products.responses';
import { ProductPresenter } from '../presenters/product.presenter';
import { ProductsSearchUseCase } from '@modules/products/application/usecases/products-search.usecase';
import { ProductsUseCase } from '@modules/products/application/usecases/products.usecase';
import { CategoriesUseCase } from '@modules/categories/application/usecases/categories.usecase';
import { Repository } from 'typeorm';
import { Product } from '@modules/products/domain/entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoriesService } from '@modules/products/application/services/products-categories-service.abstract';
import { CATEGORIES_RESPONSES } from '@modules/categories/common/categories.responses';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesUseCase: CategoriesUseCase,
    private readonly productsUseCase: ProductsUseCase,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly productsSearchUseCase: ProductsSearchUseCase,
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({
    description: 'The product has been successfully created.',
    type: ProductPresenter,
  })
  @ApiBadRequestResponse({
    description: 'The request was wrongly made.',
  })
  @ApiBody({ type: CreateProductDto })
  @ResponseMessage({ okMessage: PRODUCTS_RESPONSES.CREATED })
  async create(
    @Body() { categoryId, ...createProductDto }: CreateProductDto,
  ): Promise<ProductPresenter> {
    const nameExist = await this.productsService.checkIfExists({
      name: createProductDto.name,
    });

    if (nameExist)
      throw new ConflictException(PRODUCTS_RESPONSES.ALREADY_EXISTS('name'));

    const skuExist = await this.productsService.checkIfExists({
      sku: createProductDto.sku,
    });

    if (skuExist)
      throw new ConflictException(PRODUCTS_RESPONSES.ALREADY_EXISTS('sku'));

    const category = await this.productCategoriesService.getCategoryById(
      categoryId,
    );
    if (!category)
      throw new BadRequestException(PRODUCTS_RESPONSES.CATEGORY_NOT_EXIST);

    const productData = { ...createProductDto, category };
    const result = await this.productsUseCase.createProduct(productData);

    if (!result)
      throw new InternalServerErrorException(PRODUCTS_RESPONSES.NOT_CREATED);

    return result;
  }

  async createProductWithCategoriesUseCase(
    createProductDto: CreateProductDto,
  ): Promise<ProductPresenter> {
    const category = await this.categoriesUseCase.getCategoryById(
      createProductDto.categoryId,
    );
    const productData = { ...createProductDto, category };
    return this.productsUseCase.createProduct(productData);
  }

  async createProductWithEagerLoading(
    createProductDto: CreateProductDto,
  ): Promise<ProductPresenter> {
    const product = this.productsRepository.create(createProductDto);
    product.category = { id: createProductDto.categoryId } as any;
    const result = await this.productsRepository.save(product);
    return this.productsRepository.findOne({
      where: { id: result.id },
      relations: ['category'],
    });
  }

  async createProductWithSimplificatedObject(
    createProductDto: CreateProductDto,
  ): Promise<ProductPresenter> {
    const { categoryId, ...productData } = createProductDto;
    const product = this.productsRepository.create({
      ...productData,
      category: { id: categoryId },
    });
    return await this.productsRepository.save(product);
  }

  async createProductWithAbstractService({
    categoryId,
    ...createProductDto
  }: CreateProductDto): Promise<ProductPresenter> {
    const category = await this.productCategoriesService.getCategoryById(
      categoryId,
    );
    // Check if category exists
    const productData = { ...createProductDto, category };
    return this.productsUseCase.createProduct(productData);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Get a list of products by keyword',
  })
  @ApiOkResponse({
    description:
      'Returns a list of products that contains the keyword provided ',
    type: ProductPresenter,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'The keyword provided was invalid',
  })
  @ApiNotFoundResponse({
    description: 'No products were found containing the keyword provided',
  })
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: false,
    description: 'The keyword to search in the products',
  })
  @ResponseMessage({
    okMessage: PRODUCTS_RESPONSES.FOUND_MANY,
    emptyArrayMessage: PRODUCTS_RESPONSES.NOT_FOUND_MANY,
  })
  search(
    @Query() params: SearchProductByKeywordParams,
  ): Promise<ProductPresenter[]> {
    return this.productsSearchUseCase.searchProductsByKeyword(params.keyword);
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Get a list of products by criteria',
  })
  @ApiOkResponse({
    description: 'Returns a list of products that meets the criteria provided ',
    type: ProductPresenter,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'The criteria provided was invalid',
  })
  @ApiNotFoundResponse({
    description: 'No products were found with the criteria provided',
  })
  @ApiQuery({
    name: 'name',
    type: 'string',
    required: false,
    description: 'The name of the product',
  })
  @ApiQuery({
    name: 'isActive',
    type: 'boolean',
    required: false,
    description: 'The active status of the product',
  })
  @ResponseMessage({
    okMessage: PRODUCTS_RESPONSES.FOUND_MANY,
    emptyArrayMessage: PRODUCTS_RESPONSES.NOT_FOUND_MANY,
  })
  filter(
    @Query() criteria: FilterProductByCriteriaParams,
  ): Promise<ProductPresenter[]> {
    return this.productsSearchUseCase.filterProductsByCriteria({
      name: criteria.name,
      isActive: criteria.isActive,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a product by ID',
  })
  @ApiOkResponse({
    description: 'Returns the product with the specified ID.',
    type: ProductPresenter,
  })
  @ApiBadRequestResponse({
    description: 'The product ID was invalid.',
  })
  @ApiNotFoundResponse({
    description: 'The product with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the product',
  })
  @ResponseMessage({ okMessage: PRODUCTS_RESPONSES.FOUND_ONE })
  async findOne(
    @Param() params: FindOneProductParams,
  ): Promise<ProductPresenter> {
    const result = await this.productsUseCase.getProductById(params.id);

    if (!result) throw new NotFoundException(PRODUCTS_RESPONSES.NOT_FOUND_ONE);

    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all products' })
  @ApiOkResponse({
    description: 'Returns a list of all products.',
    type: ProductPresenter,
    isArray: true,
  })
  @ResponseMessage({ okMessage: PRODUCTS_RESPONSES.FOUND_MANY })
  findAll(): Promise<ProductPresenter[]> {
    return this.productsUseCase.getAllProducts();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiNoContentResponse({
    description: 'The product has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'The request was wrongly made.',
  })
  @ApiNotFoundResponse({
    description: 'The product with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the product',
  })
  @ApiBody({ type: UpdateProductDto })
  @ResponseMessage({ okMessage: PRODUCTS_RESPONSES.UPDATED })
  async update(
    @Param() params: UpdateProductParams,
    @Body() { categoryId, ...updateProductDto }: UpdateProductDto,
  ): Promise<ProductPresenter> {
    if (updateProductDto.name) {
      const nameExist = await this.productsService.checkIfExists({
        name: updateProductDto.name,
      });
      if (nameExist)
        throw new ConflictException(PRODUCTS_RESPONSES.ALREADY_EXISTS('name'));
    }

    if (updateProductDto.sku) {
      const skuExist = await this.productsService.checkIfExists({
        sku: updateProductDto.sku,
      });

      if (skuExist)
        throw new ConflictException(PRODUCTS_RESPONSES.ALREADY_EXISTS('sku'));
    }

    const productData: Partial<Product> = { ...updateProductDto };

    if (categoryId) {
      const category = await this.productCategoriesService.getCategoryById(
        categoryId,
      );
      if (!category)
        throw new BadRequestException(PRODUCTS_RESPONSES.CATEGORY_NOT_EXIST);

      productData.category = category;
    }

    const result = await this.productsUseCase.updateProduct(
      params.id,
      productData,
    );

    if (!result) throw new NotFoundException(PRODUCTS_RESPONSES.NOT_FOUND_ONE);

    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiNoContentResponse({
    description: 'The product has been successfully deleted.',
  })
  @ApiBadRequestResponse({
    description: 'The product ID was invalid.',
  })
  @ApiNotFoundResponse({
    description: 'The product with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'The ID of the product',
  })
  @ResponseMessage({ okMessage: PRODUCTS_RESPONSES.DELETED })
  async delete(@Param() params: DeleteProductParams): Promise<void> {
    const result = await this.productsUseCase.deleteProduct(params.id);

    if (!result) throw new NotFoundException(PRODUCTS_RESPONSES.NOT_FOUND_ONE);
  }
}

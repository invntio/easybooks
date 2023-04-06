import {
  FormatedResponse,
  FormatedErrorResponse,
} from '@common/interfaces/formatedresponses.interface';
import { CreateCategoryDto } from '@modules/categories/dto/create-category.dto';
import { Category } from '@modules/categories/entities/category.entity';
import {
  CATEGORY_CREATED,
  CATEGORY_DELETED,
  CATEGORY_FOUND_MANY,
  CATEGORY_FOUND_ONE,
  CATEGORY_UPDATED,
} from '@modules/categories/utils/category-response.constants';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FormatResponseInterceptor } from '@common/interceptors/formatresponse.interceptor';
import { Reflector } from '@nestjs/core';
import { XSSInterceptor } from '@common/interceptors/xss.interceptor';
import { TransformResponseFilter } from '@common/filters/transformresponse.filter';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoriesRepository: Repository<Category>;

  let mockCategory: Partial<Category> = {
    createdAt: new Date(),
    isActive: true,
    name: 'Mock Category',
    parentId: null,
  };

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // const configService = moduleRef.get<ConfigService>(ConfigService);
    // console.log(configService.get('database'));

    categoriesRepository = moduleRef.get<Repository<Category>>(
      getRepositoryToken(Category),
    );

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        disableErrorMessages: false,
        forbidNonWhitelisted: true,
      }),
    );

    app.useGlobalInterceptors(
      new XSSInterceptor(),
      new ClassSerializerInterceptor(app.get(Reflector)),
      new FormatResponseInterceptor(app.get(Reflector)),
    );

    app.useGlobalFilters(new TransformResponseFilter());

    await app.init();

    await categoriesRepository.clear();
    mockCategory = categoriesRepository.create(mockCategory);
    mockCategory = await categoriesRepository.save(mockCategory);
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /categories (find all)', async () => {
    const expectedStatusCode = HttpStatus.OK;

    const res = await request(app.getHttpServer())
      .get('/categories')
      .expect(expectedStatusCode);

    // Validate response format
    expect(res.body).toEqual(
      expect.objectContaining<FormatedResponse<Category[]>>({
        success: true,
        data: expect.any(Array),
        message: CATEGORY_FOUND_MANY,
        statusCode: expectedStatusCode,
      }),
    );

    // Validate response data
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining<Category>({
          id: expect.any(String),
          createdAt: expect.any(String),
          isActive: expect.any(Boolean),
          name: expect.any(String),
          parentId: null,
        }),
      ]),
    );
  });

  it('GET /categories/:id (find one)', async () => {
    const expectedStatusCode = HttpStatus.OK;

    const res = await request(app.getHttpServer())
      .get(`/categories/${mockCategory.id}`)
      .expect(expectedStatusCode);

    // Validate response format
    expect(res.body).toEqual(
      expect.objectContaining<FormatedResponse<Category>>({
        success: true,
        data: expect.any(Object),
        message: CATEGORY_FOUND_ONE,
        statusCode: expectedStatusCode,
      }),
    );

    // Validate response data
    expect(res.body.data).toEqual(
      expect.objectContaining<Category>({
        id: expect.any(String),
        createdAt: expect.any(String),
        isActive: expect.any(Boolean),
        name: expect.any(String),
        parentId: null,
      }),
    );
  });

  it('GET /categories/subcategories (find all with subcategories)', async () => {
    const expectedStatusCode = HttpStatus.OK;

    const res = await request(app.getHttpServer())
      .get('/categories/subcategories')
      .expect(expectedStatusCode);

    // Validate response format
    expect(res.body).toEqual(
      expect.objectContaining<FormatedResponse<Category[]>>({
        success: true,
        data: expect.any(Array),
        message: CATEGORY_FOUND_MANY,
        statusCode: expectedStatusCode,
      }),
    );

    // Validate response data
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining<Category>({
          id: expect.any(String),
          createdAt: expect.any(String),
          isActive: expect.any(Boolean),
          name: expect.any(String),
          parentId: null,
          subcategories: expect.any(Array),
        }),
      ]),
    );
  });

  it('GET /categories/subcategories/:id (find one with subcategories)', async () => {
    const expectedStatusCode = HttpStatus.OK;

    const res = await request(app.getHttpServer())
      .get(`/categories/subcategories/${mockCategory.id}`)
      .expect(expectedStatusCode);

    // Validate response format
    expect(res.body).toEqual(
      expect.objectContaining<FormatedResponse<Category>>({
        success: true,
        data: expect.any(Object),
        message: CATEGORY_FOUND_ONE,
        statusCode: expectedStatusCode,
      }),
    );

    // Validate response data
    expect(res.body.data).toEqual(
      expect.objectContaining<Category>({
        id: expect.any(String),
        createdAt: expect.any(String),
        isActive: expect.any(Boolean),
        name: expect.any(String),
        parentId: null,
        subcategories: expect.any(Array),
      }),
    );
  });

  it('POST /categories/:id (create category)', async () => {
    const expectedCreateStatusCode = HttpStatus.CREATED;

    const newCategory: CreateCategoryDto = {
      name: 'New Category',
      isActive: true,
      parentId: null,
    };

    const res = await request(app.getHttpServer())
      .post(`/categories`)
      .send(newCategory)
      .expect(expectedCreateStatusCode);

    // Validate response format
    expect(res.body).toEqual(
      expect.objectContaining<FormatedResponse<Category>>({
        success: true,
        data: expect.any(Object),
        message: CATEGORY_CREATED,
        statusCode: expectedCreateStatusCode,
      }),
    );

    // Validate response data
    expect(res.body.data).toEqual(
      expect.objectContaining<Partial<Category>>({
        ...newCategory,
      }),
    );
  });

  it('PATCH /categories/:id (update category)', async () => {
    const expectedUpdateStatusCode = HttpStatus.OK;
    const expectedFindOneStatusCode = HttpStatus.OK;

    const newName = 'Changed Name';

    // Update entity
    const updateResponse = await request(app.getHttpServer())
      .patch(`/categories/${mockCategory.id}`)
      .send({ name: newName } as Partial<Category>)
      .expect(expectedUpdateStatusCode);

    // Find changed entity
    const findResponse = await request(app.getHttpServer())
      .get(`/categories/${mockCategory.id}`)
      .expect(expectedFindOneStatusCode);

    // Validate update response format
    expect(updateResponse.body).toEqual(
      expect.objectContaining<FormatedResponse<null>>({
        success: true,
        message: CATEGORY_UPDATED,
        statusCode: expectedUpdateStatusCode,
      }),
    );

    // Validate find response format
    expect(findResponse.body).toEqual(
      expect.objectContaining<FormatedResponse<Category>>({
        success: true,
        data: expect.any(Object),
        message: CATEGORY_FOUND_ONE,
        statusCode: expectedFindOneStatusCode,
      }),
    );

    // Validate find response data
    expect(findResponse.body.data).toEqual(
      expect.objectContaining<Partial<Category>>({
        id: mockCategory.id,
        name: newName,
      }),
    );
  });

  it('DELETE /categories/:id (delete category)', async () => {
    const expectedStatusCode = HttpStatus.OK;

    const res = await request(app.getHttpServer())
      .delete(`/categories/${mockCategory.id}`)
      .expect(expectedStatusCode);

    // Validate response format
    expect(res.body).toEqual(
      expect.objectContaining<FormatedResponse<null>>({
        success: true,
        message: CATEGORY_DELETED,
        statusCode: expectedStatusCode,
      }),
    );
  });

  describe('Error Handling', () => {
    it('should throw an error when passed unexpected props', async () => {
      const expectedStatusCode = HttpStatus.BAD_REQUEST;
      const unexpectedPropertyName = 'unexpectedProp';

      const newCategory: CreateCategoryDto | any = {
        name: 'New Category',
        isActive: true,
        parentId: null,
        ...JSON.parse(
          `{"${unexpectedPropertyName}": "this property is not expected"}`,
        ),
      };

      const res = await request(app.getHttpServer())
        .post(`/categories`)
        .send(newCategory)
        .expect(expectedStatusCode);

      // Validate response format
      expect(res.body).toEqual(
        expect.objectContaining<FormatedResponse<Category>>({
          success: false,
          message: `Property ${unexpectedPropertyName} should not exist`,
          statusCode: expectedStatusCode,
        }),
      );
    });

    it('should throw an error when passed invalid type props', async () => {
      const expectedStatusCode = HttpStatus.BAD_REQUEST;

      const newCategory: CreateCategoryDto | any = {
        name: 'New Category',
        isActive: true,
        parentId: 'this property has not valid type',
      };

      const res = await request(app.getHttpServer())
        .post(`/categories`)
        .send(newCategory)
        .expect(expectedStatusCode);

      // Validate response format
      expect(res.body).toEqual(
        expect.objectContaining<FormatedResponse<Category>>({
          success: false,
          message: `ParentId must be a UUID`,
          statusCode: expectedStatusCode,
        }),
      );
    });
  });
});

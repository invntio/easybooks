import { FormatedResponse } from '@common/interfaces/formatedresponses.interface';
import { CreateCategoryDto } from '@modules/categories/infrastructure/dto/create-category.dto';
import { Category } from '@modules/categories/domain/entity/category.entity';
import { CATEGORIES_RESPONSES } from '@modules/categories/common/categories.responses';
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
  };

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
        message: CATEGORIES_RESPONSES.FOUND_MANY,
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
        message: CATEGORIES_RESPONSES.FOUND_ONE,
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
      }),
    );
  });

  it('POST /categories/:id (create category)', async () => {
    const expectedCreateStatusCode = HttpStatus.CREATED;

    const newCategory: CreateCategoryDto = {
      name: 'New Category',
      isActive: true,
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
        message: CATEGORIES_RESPONSES.CREATED,
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
        message: CATEGORIES_RESPONSES.UPDATED,
        statusCode: expectedUpdateStatusCode,
      }),
    );

    // Validate find response format
    expect(findResponse.body).toEqual(
      expect.objectContaining<FormatedResponse<Category>>({
        success: true,
        data: expect.any(Object),
        message: CATEGORIES_RESPONSES.FOUND_ONE,
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
        message: CATEGORIES_RESPONSES.DELETED,
        statusCode: expectedStatusCode,
      }),
    );
  });

  describe('Error Handling', () => {
    it('should throw an error when passed unexpected props', async () => {
      const expectedStatusCode = HttpStatus.BAD_REQUEST;
      const unexpectedPropertyName = 'unexpectedProp';

      const newCategory: CreateCategoryDto = {
        name: 'New Category',
        isActive: true,
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

      const newCategory: CreateCategoryDto = {
        name: 'New Category',
        isActive: 'testing' as unknown as boolean,
      };

      const res = await request(app.getHttpServer())
        .post(`/categories`)
        .send(newCategory)
        .expect(expectedStatusCode);

      // Validate response format
      expect(res.body).toEqual(
        expect.objectContaining<FormatedResponse<Category>>({
          success: false,
          message: `IsActive must be a boolean value`,
          statusCode: expectedStatusCode,
        }),
      );
    });
  });
});

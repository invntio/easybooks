import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateCategoryDto } from '@modules/categories/dto/create-category.dto';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/categories/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should throw an error when passed unexpected props', async () => {
    const createCategoryDto: CreateCategoryDto | any = {
      name: 'Category Name',
      notexpected: 'testnotexpected',
    };

    const categoryDtoObject = plainToInstance(
      CreateCategoryDto,
      createCategoryDto,
    );

    const errors: ValidationError[] = await validate(categoryDtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    const expectedErrors: ValidationError[] = [
      {
        target: {
          name: 'Category Name',
          notexpected: 'testnotexpected',
        },
        value: 'testnotexpected',
        property: 'notexpected',
        children: undefined,
        constraints: {
          whitelistValidation: 'property notexpected should not exist',
        },
      },
    ];

    expect(errors).toEqual(expect.arrayContaining(expectedErrors));
  });

  it('should throw an error when passed invalid type props', async () => {
    const createCategoryDto: CreateCategoryDto | any = {
      name: 'Category Name',
      parentId: true,
    };

    const categoryDtoObject = plainToInstance(
      CreateCategoryDto,
      createCategoryDto,
    );

    const errors: ValidationError[] = await validate(categoryDtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    const expectedErrors: ValidationError[] = [
      {
        target: { name: 'Category Name', parentId: true },
        value: true,
        property: 'parentId',
        children: [],
        constraints: { isUuid: 'parentId must be a UUID' },
      },
    ];

    expect(errors).toEqual(expect.arrayContaining(expectedErrors));
  });
});

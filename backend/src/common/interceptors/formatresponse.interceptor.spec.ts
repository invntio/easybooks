import { Reflector } from '@nestjs/core';
import { FormatResponseInterceptor } from './formatresponse.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { Category } from '@modules/categories/entities/category.entity';
import { v4 as uuidV4 } from 'uuid';
import { FormatedResponse } from '@common/interfaces/formatedresponses.interface';
import { createMock } from '@golevelup/ts-jest';

describe('SerializerInterceptor', () => {
  let interceptor: FormatResponseInterceptor;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new FormatResponseInterceptor(reflector);
  });

  it('should return category data formated with message', async () => {
    const categoryData: Category = {
      id: uuidV4(),
      name: 'Test Category',
      createdAt: new Date('2023-03-22T20:26:54.000Z'),
      isActive: true,
    };

    const expectedCategoryData: FormatedResponse<Category> = {
      data: categoryData,
      success: true,
      message: 'Category found',
      statusCode: 200,
    };

    reflector.get = jest.fn().mockReturnValue('Category found');

    const ctxMock: Partial<ExecutionContext> | any = {
      switchToHttp: () => ({
        getResponse: () => ({ statusCode: 200 }),
      }),
      getHandler: () => ({}),
    };

    const callHandlerMock = createMock<CallHandler>({
      handle: () => of(categoryData),
    });

    const categoryDataObservable = interceptor.intercept(
      ctxMock,
      callHandlerMock,
    );
    const formatedCategoryData = await lastValueFrom(categoryDataObservable);

    expect(formatedCategoryData).toEqual(expectedCategoryData);
  });

  it('should return category data formated with empty message if response message metadata not found', async () => {
    const categoryData: Category = {
      id: uuidV4(),
      name: 'Test Category',
      createdAt: new Date('2023-03-22T20:26:54.000Z'),
      isActive: true,
    };

    const expectedCategoryData: FormatedResponse<Category> = {
      data: categoryData,
      success: true,
      message: '',
      statusCode: 200,
    };

    const ctxMock: Partial<ExecutionContext> | any = {
      switchToHttp: () => ({
        getResponse: () => ({ statusCode: 200 }),
      }),
      getHandler: () => ({}),
    };

    const callHandlerMock = createMock<CallHandler>({
      handle: () => of(categoryData),
    });

    const categoryDataObservable = interceptor.intercept(
      ctxMock,
      callHandlerMock,
    );
    const formatedCategoryData = await lastValueFrom(categoryDataObservable);

    expect(formatedCategoryData).toEqual(expectedCategoryData);
  });
});

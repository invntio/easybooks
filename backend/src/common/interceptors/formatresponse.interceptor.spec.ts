import { Reflector } from '@nestjs/core';
import { FormatResponseInterceptor } from './formatresponse.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { FormatedResponse } from '@common/interfaces/formatedresponses.interface';
import { createMock } from '@golevelup/ts-jest';

type ExampleEntityType = {
  id: string;
  name: string;
  createdAt: Date;
};

describe('SerializerInterceptor', () => {
  let interceptor: FormatResponseInterceptor;
  let reflector: Reflector;
  let entityData: ExampleEntityType;
  const createExpectedResponseData = async (
    responseData: ExampleEntityType,
    responseStatusCpde: number,
    responseMessage?: string,
  ): Promise<FormatedResponse<ExampleEntityType>> => {
    if (responseMessage) {
      reflector.get = jest.fn().mockReturnValue('Entity found');
    }

    const ctxMock = createMock<ExecutionContext>({
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => ({ statusCode: responseStatusCpde }),
      }),
      getHandler: () => ({}),
    });

    const callHandlerMock = createMock<CallHandler>({
      handle: () => of(responseData),
    });

    const entityDataObservable = interceptor.intercept(
      ctxMock,
      callHandlerMock,
    );
    const formatedResponse: FormatedResponse<ExampleEntityType> =
      await lastValueFrom(entityDataObservable);

    return formatedResponse;
  };

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new FormatResponseInterceptor(reflector);
    entityData = {
      id: uuidV4(),
      name: 'Test Entity',
      createdAt: new Date(),
    };
  });

  it('should return entity data formated with message', async () => {
    const expectedEntityData: FormatedResponse<ExampleEntityType> = {
      data: entityData,
      success: true,
      message: 'Entity found',
      statusCode: 200,
    };

    const formatedResponse = await createExpectedResponseData(
      entityData,
      200,
      'Entity found',
    );

    expect(formatedResponse).toEqual(expectedEntityData);
  });

  it('should return entity data formated with empty message if response message metadata not found', async () => {
    const expectedEntityData: FormatedResponse<ExampleEntityType> = {
      data: entityData,
      success: true,
      message: '',
      statusCode: 200,
    };

    const formatedResponse = await createExpectedResponseData(entityData, 200);

    expect(formatedResponse).toEqual(expectedEntityData);
  });
});

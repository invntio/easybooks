import { Reflector } from '@nestjs/core';
import { FormatResponseInterceptor } from './formatresponse.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { FormatedResponse } from '@common/interfaces/formatedresponses.interface';
import { createMock } from '@golevelup/ts-jest';
import { ResponseMessageOptions } from '@common/decorators/response.decorator';

type ExampleEntityType = {
  id: string;
  name: string;
  createdAt: Date;
};

describe('FormatResponseInterceptor', () => {
  let interceptor: FormatResponseInterceptor;
  let reflector: Reflector;
  let entityData: ExampleEntityType;
  const createExpectedResponseData = async (
    responseData: ExampleEntityType | ExampleEntityType[],
    responseStatusCpde: number,
    responseMessage?: string,
  ): Promise<FormatedResponse<ExampleEntityType>> => {
    if (responseMessage) {
      reflector.get = jest.fn().mockReturnValue({
        okMessage: 'Entity found',
        emptyArrayMessage: 'Entities not found',
      } as ResponseMessageOptions);
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

  it('should return entity data formated with empty array message if data is an empty array', async () => {
    const expectedEntityData: FormatedResponse<ExampleEntityType[]> = {
      data: [],
      success: true,
      message: 'Entities not found',
      statusCode: 200,
    };

    const formatedResponse = await createExpectedResponseData(
      [],
      200,
      'Entities not found',
    );

    expect(formatedResponse).toEqual(expectedEntityData);
  });
});

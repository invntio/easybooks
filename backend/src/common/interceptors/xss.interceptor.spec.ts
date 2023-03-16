import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, firstValueFrom } from 'rxjs';
import { XSSInterceptor } from './xss.interceptor';
import * as XSSCleanUtil from '@common/utils/xssclean.util';

describe('XSSInterceptor', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [XSSInterceptor],
    }).compile();
  });

  it('should be defined', () => {
    expect(new XSSInterceptor()).toBeDefined();
  });

  it('should sanitize request inputs', async () => {
    const interceptor = app.get<XSSInterceptor>(XSSInterceptor);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          body: { name: '<script>alert("xss")</script>' },
          query: { search: '<script>alert("xss")</script>' },
          params: { id: '<script>alert("xss")</script>' },
        }),
      }),
    } as ExecutionContext;

    const handler = {
      handle: () => of(null),
    } as CallHandler;

    const xssCleanObjectSpyFn = jest.spyOn(XSSCleanUtil, 'xssCleanObject');
    const result = await firstValueFrom(
      interceptor.intercept(context, handler),
    );

    expect(xssCleanObjectSpyFn).toHaveBeenCalled();
    expect(xssCleanObjectSpyFn).toHaveReturnedTimes(3);
    expect(result).toEqual(null);
  });
});

import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Options } from 'pino-http';
import pinoConsoleFileLogger from './pino-logger';
import { TransportMultiOptions } from 'pino';
import { v4 as uuidV4 } from 'uuid';
import { CORRELATION_ID_HEADER } from '@common/middlewares/correlation-id/correlation-id.middleware';

describe('pinoConsolefileLogger', () => {
  let configService: ConfigService;
  let mockRequest: Request;
  let mockResponse: Response;

  beforeEach(() => {
    configService = new ConfigService();
    mockRequest = {} as Request;
    mockResponse = {} as Response;

    mockRequest[CORRELATION_ID_HEADER] = uuidV4();
  });

  const assertLoggerConfiguration = (
    configService: ConfigService,
    expectedLevel: string,
    expectedTargetsCount: number,
  ) => {
    const loggerConfig = pinoConsoleFileLogger(configService);
    const pinoHttp: Options = loggerConfig.pinoHttp as Options;

    expect(pinoHttp.level).toBe(expectedLevel);
    expect(
      (pinoHttp.transport as TransportMultiOptions).targets.length,
    ).toEqual(expectedTargetsCount);
    expect(pinoHttp.customProps(mockRequest, mockResponse)).toEqual({
      correlationId: mockRequest[CORRELATION_ID_HEADER],
    });
    expect(pinoHttp.serializers.req(mockRequest)).toBeUndefined();
    expect(pinoHttp.serializers.res(mockResponse)).toBeUndefined();
  };

  it('should return the correct logger configuration for development environment', () => {
    jest.spyOn(configService, 'get').mockReturnValue('dev');
    assertLoggerConfiguration(configService, 'debug', 2);
  });

  it('should return the correct logger configuration for production environment', () => {
    jest.spyOn(configService, 'get').mockReturnValue('prod');
    assertLoggerConfiguration(configService, 'info', 2);
  });
});

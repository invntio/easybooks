import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware,
} from './correlation-id.middleware';
import { Request, Response, NextFunction } from 'express';

describe('CorrelationIdMiddleware', () => {
  let correlationIdMiddleware: CorrelationIdMiddleware;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNextFunction: NextFunction;

  beforeEach(() => {
    correlationIdMiddleware = new CorrelationIdMiddleware();
    mockRequest = {} as Request;
    mockResponse = {
      set: jest.fn(),
    } as unknown as Response;
    mockNextFunction = jest.fn();
  });

  it('should be defined', () => {
    expect(new CorrelationIdMiddleware()).toBeDefined();
  });

  it('should set correlation ID in request and response headers', () => {
    correlationIdMiddleware.use(mockRequest, mockResponse, mockNextFunction);

    expect(mockRequest[CORRELATION_ID_HEADER]).toBeDefined();
    expect(mockResponse.set).toHaveBeenCalledWith(
      CORRELATION_ID_HEADER,
      mockRequest[CORRELATION_ID_HEADER],
    );
    expect(mockNextFunction).toHaveBeenCalled();
  });
});

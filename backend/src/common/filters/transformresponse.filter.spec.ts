import { createMock } from '@golevelup/ts-jest';
import {
  ArgumentsHost,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { TransformResponseFilter } from './transformresponse.filter';

describe('TransformResponseFilter_class', () => {
  let filter: TransformResponseFilter;

  beforeEach(() => {
    filter = new TransformResponseFilter();
  });

  it('should transform error message', () => {
    const host = createMock<ArgumentsHost>();
    const response = createMock<Res>({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    });
    host.getArgs.mockReturnValueOnce([null, response, null, null]);

    const exception = new BadRequestException();
    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Bad Request',
        statusCode: 400,
      }),
    );
  });

  it('should transform error message for multiple types of errors', () => {
    const host = createMock<ArgumentsHost>();
    const response = createMock<Res>({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    });
    host.getArgs.mockReturnValueOnce([null, response, null, null]);
    host.getArgs.mockReturnValueOnce([null, response, null, null]);
    host.getArgs.mockReturnValueOnce([null, response, null, null]);

    const notFoundException = new NotFoundException();
    const badRequestSingleException = new BadRequestException('Bad Request');
    const badRequestArrayException = new BadRequestException([
      'Bad Request Array',
      'invalid input',
    ]);

    filter.catch(notFoundException, host);
    filter.catch(badRequestSingleException, host);
    filter.catch(badRequestArrayException, host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Not Found',
        statusCode: 404,
      }),
    );
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Bad Request',
        statusCode: 400,
      }),
    );
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Bad Request Array',
        statusCode: 400,
      }),
    );
  });

  it('should return transformed "Internal Server Error" message if its an unhandled error', () => {
    const host = createMock<ArgumentsHost>();
    const response = createMock<Res>({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    });
    host.getArgs.mockReturnValueOnce([null, response, null, null]);

    const exception = 'Unknown error';
    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
      }),
    );
  });
});

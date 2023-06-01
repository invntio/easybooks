import { FormatedErrorResponse } from '@common/interfaces/formatedresponses.interface';
import { capitalizeString } from '@common/utils/capitalize.util';
import {
  ArgumentsHost,
  HttpException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Response } from 'express';

@Catch()
export class TransformResponseFilter implements ExceptionFilter {
  catch(exception: Error | string, host: ArgumentsHost) {
    const response: Response = host.getArgs()[1];

    let message = 'Internal Server Error';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof Error) {
      message = exception.message;
      statusCode = HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof HttpException) {
      const errorMeesage: string | string[] =
        exception.getResponse()['message'];
      message = isArray(errorMeesage) ? errorMeesage[0] : errorMeesage;
      statusCode = exception.getStatus();
    }

    const transformedResponse: FormatedErrorResponse = {
      success:
        statusCode >= HttpStatus.OK && statusCode < HttpStatus.BAD_REQUEST,
      message: capitalizeString(message),
      statusCode,
    };

    return response.status(statusCode).json(transformedResponse);
  }
}

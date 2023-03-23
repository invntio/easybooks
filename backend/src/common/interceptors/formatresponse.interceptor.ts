import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { ResponseMessageKey } from '@common/decorators/response.decorator';
import { FormatedResponse } from '@common/interfaces/formatedresponses.interface';

@Injectable()
export class FormatResponseInterceptor<T = any>
  implements NestInterceptor<T, FormatedResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<FormatedResponse<T>> {
    const responseMessage =
      this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ??
      '';

    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        return {
          success:
            statusCode >= HttpStatus.OK && statusCode < HttpStatus.BAD_REQUEST,
          data,
          message: responseMessage,
          statusCode,
        };
      }),
    );
  }
}

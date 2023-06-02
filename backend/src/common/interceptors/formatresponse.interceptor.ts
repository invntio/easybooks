import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import {
  ResponseMessageKey,
  ResponseMessageOptions,
} from '@common/decorators/response.decorator';
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
    const responseMessageOptions: ResponseMessageOptions =
      this.reflector.get<ResponseMessageOptions>(
        ResponseMessageKey,
        context.getHandler(),
      ) ?? { okMessage: '' };

    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        let message = responseMessageOptions.okMessage;

        if (Array.isArray(data) && data.length === 0) {
          message = responseMessageOptions.emptyArrayMessage;
        }

        return {
          success:
            statusCode >= HttpStatus.OK && statusCode < HttpStatus.BAD_REQUEST,
          data,
          message: message,
          statusCode,
        };
      }),
    );
  }
}

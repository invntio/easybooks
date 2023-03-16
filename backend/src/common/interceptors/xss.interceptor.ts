import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { xssCleanObject } from '@common/utils/xssclean.util';

@Injectable()
export class XSSInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get request from context
    const req: Request = context.switchToHttp().getRequest();

    // Sanitize inputs with XSS Clean Util
    if (req.body) req.body = xssCleanObject(req.body);
    if (req.query) req.query = xssCleanObject(req.query);
    if (req.params) req.params = xssCleanObject(req.query);

    return next.handle();
  }
}

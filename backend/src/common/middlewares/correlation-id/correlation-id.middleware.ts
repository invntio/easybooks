import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidV4 } from 'uuid';

export const CORRELATION_ID_HEADER = 'X-Correlation-Id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = uuidV4();

    req[CORRELATION_ID_HEADER] = correlationId;
    res.set(CORRELATION_ID_HEADER, correlationId);

    next();
  }
}

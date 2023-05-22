import { CORRELATION_ID_HEADER } from '@common/middlewares/correlation-id/correlation-id.middleware';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Params } from 'nestjs-pino';

const pinoConsolefileLogger = (configService: ConfigService): Params => {
  return {
    pinoHttp: {
      level: configService.get('NODE_ENV') === 'dev' ? 'debug' : 'info',
      transport: {
        targets: [
          {
            level: 'info',
            target: 'pino-pretty',
            options: { messageKey: 'message' },
          },
          {
            level: 'trace',
            target: 'pino/file',
            options: { destination: './pino.log' },
          },
        ],
      },
      customProps: (req: Request) => {
        return {
          correlationId: req[CORRELATION_ID_HEADER],
        };
      },
      messageKey: 'message',
    },
  };
};

export default pinoConsolefileLogger;

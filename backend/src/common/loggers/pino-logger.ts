import { CORRELATION_ID_HEADER } from '@common/middlewares/correlation-id/correlation-id.middleware';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Params } from 'nestjs-pino';
import { Options } from 'pino-http';

const pinoConsoleFileLogger = (configService: ConfigService): Params => {
  const config: { pinoHttp: Options } = {
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
      autoLogging: false,
      customProps: (req: Request) => {
        return {
          correlationId: req[CORRELATION_ID_HEADER],
        };
      },
      serializers: {
        req: () => {
          return undefined;
        },
        res: () => {
          return undefined;
        },
      },
      messageKey: 'message',
    },
  };

  return config;
};

export default pinoConsoleFileLogger;

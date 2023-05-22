import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envConfig, ormConfig } from '@config/index';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { LoggerModule } from 'nestjs-pino';
import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware,
} from '@common/middlewares/correlation-id/correlation-id.middleware';
import { Request } from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath: ['.env', '.env.prod', '.env.dev', '.env.test'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ormConfig,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
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
        // TODO: Add abstraction layer
      },
    }),
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}

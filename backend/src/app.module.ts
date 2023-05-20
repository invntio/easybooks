import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envConfig, ormConfig } from '@config/index';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { LoggerModule } from 'nestjs-pino';

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
      pinoHttp: [
        {
          level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
          transport:
            process.env.NODE_ENV === 'dev'
              ? { target: 'pino-pretty', options: { messageKey: 'message' } }
              : undefined,
          messageKey: 'message',
        },
        {
          write: (msg) => `massimus ${msg}`,
        },
      ],
    }),
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

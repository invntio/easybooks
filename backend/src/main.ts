import { XSSInterceptor } from '@common/interceptors/xss.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { FormatResponseInterceptor } from '@common/interceptors/formatresponse.interceptor';
import { TransformResponseFilter } from '@common/filters/transformresponse.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Load environment variables
  const configService = app.get(ConfigService);

  // Use helmet for security headers
  app.use(
    helmet({
      hidePoweredBy: true,
      xssFilter: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Enable data sanitization
  app.useGlobalInterceptors(new XSSInterceptor());

  // Use validation pipe for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: false,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable Response Serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Enable Format Response Interceptor
  app.useGlobalInterceptors(new FormatResponseInterceptor(app.get(Reflector)));

  // Enable Format Response Filter
  app.useGlobalFilters(new TransformResponseFilter());

  // Configure Swagger documentation
  const nodeEnv = configService.get('NODE_ENV');

  if (nodeEnv === 'dev') {
    const options = new DocumentBuilder()
      .setTitle('Invntio')
      .setDescription('Open-source Inventory Management System')
      .setVersion('0.1.0')
      .setLicense('MIT', 'https://github.com/invntio/invntio/blob/main/LICENSE')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  // Set up logging with Pino
  app.useLogger(app.get(Logger));

  // Get port from config service
  const port = configService.get('port');

  await app.listen(port);
}

(async () => {
  try {
    await bootstrap();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

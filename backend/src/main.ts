import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Use validation pipe for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Configure Swagger documentation
  const options = new DocumentBuilder()
    .setTitle('Inventio')
    .setDescription('Open-source Inventory Management System')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Set up logging with Winston
  const logger = new Logger();
  app.useLogger(logger);

  // Get port from config service
  const port = configService.get('port');

  await app.listen(port);
}
bootstrap();

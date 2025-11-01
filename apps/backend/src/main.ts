import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware
  app.use(helmet());
  app.enableCors();
  app.use(cookieParser());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Emma Project API')
    .setDescription('The Emma Project API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('jwt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📚 Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();

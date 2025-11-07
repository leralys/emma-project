// Load environment variables FIRST, before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Try multiple possible paths for the .env file
const possibleEnvPaths = [
  resolve(__dirname, '../../../.env'), // From dist/apps/backend/main.js
  resolve(__dirname, '../../.env'), // Alternative path
  resolve(process.cwd(), '.env'), // From project root
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  const result = config({ path: envPath });
  if (!result.error) {
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.error('⚠️  Could not load .env file from any location');
}

// Now import other modules
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS Configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Refresh-Token'],
    credentials: false, // Not needed for Authorization header auth
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTO (security!)
      transform: true, // Auto-transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw error if extra properties sent
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Swagger Documentation (development only)
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Emma Project API')
      .setDescription('The Emma Project API documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);

  if (!isProduction) {
    Logger.log(`📚 Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`);
  }
}

bootstrap();

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { runMigration } from '@graba25-be/migrations/run-migration';
import { TransformInterceptor } from '@graba25-be/shared/interceptors/transform-response.interceptor';
import cookieParser from 'cookie-parser';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get('BY25_URL'),
    credentials: true,
  });
  app.use(cookieParser());

  console.log('environment ===> ', process.env.NODE_ENV);

  // DB migration
  const migrateDb = configService.get('MIGRATE_DB');
  if (migrateDb) {
    await runMigration();
  }

  app.useGlobalInterceptors(new TransformInterceptor());

  // Log to check if environment variables are loaded correctly
  console.log('SERVER_URL:', configService.get('SERVER_URL'));

  return app;
}

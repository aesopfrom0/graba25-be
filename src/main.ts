import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { runMigration } from '@graba25-be/migrations/run-migration';
import { TransformInterceptor } from '@graba25-be/shared/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);

  //db migration
  const migrateDb = configService.get('MIGRATE_DB');
  migrateDb && (await runMigration());

  app.useGlobalInterceptors(new TransformInterceptor());

  const env = configService.get('NODE_ENV');
  const port = configService.get('PORT');
  await app.listen(port, () => {
    console.log(`${env} server listening on ${port}`);
  });
}
bootstrap();

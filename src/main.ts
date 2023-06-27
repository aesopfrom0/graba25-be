import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { runMigration } from './migrations/run-migration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);

  //db migration
  const migrateDb = configService.get('MIGRATE_DB');
  migrateDb && (await runMigration());

  const env = configService.get('NODE_ENV');
  const port = configService.get('PORT');
  await app.listen(port, () => {
    console.log(`${env} server listening on ${port}`);
  });
}
bootstrap();

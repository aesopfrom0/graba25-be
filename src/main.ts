import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { runMigration } from '@graba25-be/migrations/run-migration';
import { TransformInterceptor } from '@graba25-be/shared/interceptors/transform-response.interceptor';
import { APIGatewayProxyHandler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';

let server: APIGatewayProxyHandler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);

  console.log('environment ===> ', process.env.NODE_ENV);

  // DB migration
  const migrateDb = configService.get('MIGRATE_DB');
  migrateDb && (await runMigration());

  app.useGlobalInterceptors(new TransformInterceptor());

  // Log to check if environment variables are loaded correctly
  console.log('SERVER_URL:', configService.get('SERVER_URL'));

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

const handler = async (event, context, callback) => {
  if (!server) {
    server = server ?? (await bootstrap());
  }

  return server(event, context, callback);
};

bootstrap();

export { handler };

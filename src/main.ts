import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { runMigration } from '@graba25-be/migrations/run-migration';
import { TransformInterceptor } from '@graba25-be/shared/interceptors/transform-response.interceptor';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { APIGatewayProxyHandler } from 'aws-lambda';

const server = express();
const adapter = new ExpressAdapter(server);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors();
  const configService = app.get(ConfigService);

  // DB migration
  const migrateDb = configService.get('MIGRATE_DB');
  migrateDb && (await runMigration());

  app.useGlobalInterceptors(new TransformInterceptor());

  // Log to check if environment variables are loaded correctly
  console.log('SERVER_URL:', configService.get('SERVER_URL'));

  await app.init();
}

let cachedServer;
const handler: APIGatewayProxyHandler = (event, context) => {
  if (!cachedServer) {
    cachedServer = createServer(server);
  }

  return proxy(cachedServer, event, context, 'PROMISE').promise;
};

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'local') {
  // Running locally
  bootstrap().then(() => {
    const port = process.env.PORT || 4100;
    server.listen(port, () => {
      console.log(`Local server listening on port ${port}`);
    });
  });
} else {
  // Running in AWS Lambda
  bootstrap();
}

export { handler };

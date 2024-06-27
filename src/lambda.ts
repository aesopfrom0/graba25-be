import { APIGatewayProxyHandler, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import { createApp } from './bootstrap';
import { BatchService } from '@graba25-be/providers/batch/batch.service';

let server: APIGatewayProxyHandler;

async function bootstrap() {
  const app = await createApp();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event, context, callback) => {
  if (!server) {
    server = await bootstrap();
  }

  return server(event, context, callback);
};

export const recordHarvests: Handler = async (event, context, callback) => {
  const app = await createApp();
  const batchService = app.get(BatchService);
  try {
    const result = await batchService.recordHarvests();
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Harvest records processed successfully',
        result,
      }),
    });
  } catch (e: any) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing harvest records',
        error: e.message,
      }),
    });
  }
};

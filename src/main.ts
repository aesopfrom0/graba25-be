import { createApp } from '@graba25-be/bootstrap';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);

  const env = configService.get('NODE_ENV');
  if (env === 'local') {
    const port = configService.get('PORT');
    await app.listen(port, () => {
      console.log(`${env} server listening on ${port}`);
    });
  } else {
    await app.listen(3000); // Default port for non-local environments
  }
}

bootstrap();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateSchema } from './config/validate-schema';
import { TasksModule } from './tasks/tasks.module';
import { DbServicesModule } from './providers/db-services/db-services.module';

const config = new ConfigService();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/.${config.get('NODE_ENV')}.env`],
      isGlobal: true,
      validationSchema: validateSchema(),
      validationOptions: {
        abortEarly: true,
      },
    }),
    TasksModule,
    DbServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateSchema } from './config/validate-schema';
import { TasksModule } from './tasks/tasks.module';
import { NotionDbServicesModule } from './providers/databases/notion/notion-db-services.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDbServicesModule } from 'src/providers/databases/mongodb/mongodb-services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
      validationSchema: validateSchema(),
      validationOptions: {
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    TasksModule,
    NotionDbServicesModule,
    MongoDbServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

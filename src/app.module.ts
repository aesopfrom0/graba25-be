import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateSchema } from './config/validate-schema';
import { TasksModule } from './domains/tasks/tasks.module';
import { NotionDbServicesModule } from './providers/databases/notion/notion-db-services.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DbServicesModule } from 'src/providers/databases/db/db-services.module';
import { ProjectsModule } from './domains/projects/projects.module';
import { UsersModule } from './domains/users/users.module';
import { ShutdownModule } from '@graba25-be/providers/shutdown/shutdown.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@graba25-be/shared/filters/all-exception.filter';

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
        autoCreate: true,
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),
    TasksModule,
    NotionDbServicesModule,
    DbServicesModule,
    ProjectsModule,
    UsersModule,
    ShutdownModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

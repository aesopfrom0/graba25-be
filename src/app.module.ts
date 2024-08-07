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
import { TimeLogModule } from './domains/time-log/time-log.module';
import { AuthModule } from './domains/auth/auth.module';
import { HarvestModule } from './domains/harvest/harvest.module';
import { BatchModule } from './providers/batch/batch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/.env.${process.env.NODE_ENV}`],
      // envFilePath: [`${__dirname}/.env.${process.env.NODE_ENV}`],
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
    TimeLogModule,
    AuthModule,
    HarvestModule,
    BatchModule,
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

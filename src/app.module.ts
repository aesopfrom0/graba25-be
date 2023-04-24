import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateSchema } from './config/validate-schema';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TaskEntity } from './tasks/entities/task.entity';
import { DbServicesModule } from './providers/db-services/db-services.module';
import configuration from './config/configuration';

const config = new ConfigService();
@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: [`./dist/config/${process.env.NODE_ENV}-config.yaml`],
      load: [configuration],
      isGlobal: true,
      validationSchema: validateSchema(),
      validationOptions: {
        abortEarly: true,
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      // type: 'sqlite',
      // database: ':memory:',
      type: 'postgres',
      host: config.get('db.host'),
      port: config.get('db.port'),
      username: config.get('db.username'),
      password: config.get('db.password'),
      database: config.get('db.database'),
      entities: [TaskEntity],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
    }),
    TasksModule,
    DbServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

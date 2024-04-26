import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { NotionDbServicesModule } from '../providers/databases/notion/notion-db-services.module';
import { MongoDbServicesModule } from 'src/providers/databases/mongodb/mongodb-services.module';

@Module({
  imports: [NotionDbServicesModule, MongoDbServicesModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}

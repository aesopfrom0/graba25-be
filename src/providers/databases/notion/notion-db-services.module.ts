import { Module } from '@nestjs/common';
import { TaskNotionDbService } from './services/task-notion-db.service';

@Module({
  providers: [TaskNotionDbService],
  exports: [TaskNotionDbService],
})
export class NotionDbServicesModule {}

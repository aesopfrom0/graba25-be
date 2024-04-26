import { Module } from '@nestjs/common';
import { TaskNotionDbService } from './services/task-notion-db.service';
import { TimeLogNotionDbService } from './services/time-log-notion-db.service';

@Module({
  providers: [TaskNotionDbService, TimeLogNotionDbService],
  exports: [TaskNotionDbService, TimeLogNotionDbService],
})
export class NotionDbServicesModule {}

import { Module } from '@nestjs/common';
import { TaskDbService } from './notion-services/task-db.service';
import { TimeLogDbService } from './notion-services/time-log-db.service';

@Module({
  providers: [TaskDbService, TimeLogDbService],
  exports: [TaskDbService, TimeLogDbService],
})
export class DbServicesModule {}

import { Module } from '@nestjs/common';
import { TaskDbService } from './services/task-db.service';
import { TimeLogDbService } from './services/time-log-db.service';

@Module({
  providers: [TaskDbService, TimeLogDbService],
  exports: [TaskDbService, TimeLogDbService],
})
export class DbServicesModule {}

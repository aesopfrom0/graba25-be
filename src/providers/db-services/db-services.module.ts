import { Module } from '@nestjs/common';
import { TaskDbService } from './services/task-db.service';

@Module({
  providers: [TaskDbService],
  exports: [TaskDbService],
})
export class DbServicesModule {}

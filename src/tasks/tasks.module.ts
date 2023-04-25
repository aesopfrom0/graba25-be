import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DbServicesModule } from '../providers/db-services/db-services.module';

@Module({
  imports: [DbServicesModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}

import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { NotionDbServicesModule } from '../../providers/databases/notion/notion-db-services.module';
import { DbServicesModule } from 'src/providers/databases/db/db-services.module';

@Module({
  imports: [NotionDbServicesModule, DbServicesModule],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}

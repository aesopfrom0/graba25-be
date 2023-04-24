import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import {DbServicesModule} from "../providers/db-services/db-services.module";

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), DbServicesModule],
  providers: [TasksService, TasksResolver],
  controllers: [TasksController],
})
export class TasksModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/providers/databases/mongodb/schemas/task.schema';
import { TaskDbService } from 'src/providers/databases/mongodb/services/task-db.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])],
  providers: [TaskDbService],
  exports: [TaskDbService],
})
export class MongoDbServicesModule {}

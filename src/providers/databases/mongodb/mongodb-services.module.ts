import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/providers/databases/mongodb/schemas/task.schema';
import { UserSchema } from 'src/providers/databases/mongodb/schemas/user.schema';
import { TaskDbService } from 'src/providers/databases/mongodb/services/task-db.service';
import { UserDbService } from 'src/providers/databases/mongodb/services/user-db.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [TaskDbService, UserDbService],
  exports: [TaskDbService, UserDbService],
})
export class MongoDbServicesModule {}

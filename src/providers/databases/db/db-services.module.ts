import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from 'src/providers/databases/db/schemas/project.schema';
import { TaskSchema } from 'src/providers/databases/db/schemas/task.schema';
import { UserSchema } from 'src/providers/databases/db/schemas/user.schema';
import { ProjectDbService } from 'src/providers/databases/db/services/project-db.service';
import { TaskDbService } from 'src/providers/databases/db/services/task-db.service';
import { UserDbService } from 'src/providers/databases/db/services/user-db.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
  ],
  providers: [TaskDbService, UserDbService, ProjectDbService],
  exports: [TaskDbService, UserDbService, ProjectDbService],
})
export class DbServicesModule {}

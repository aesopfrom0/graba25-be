import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from '@graba25-be/providers/databases/db/schemas/project.schema';
import { TaskSchema } from '@graba25-be/providers/databases/db/schemas/task.schema';
import {
  IntervalSchema,
  TimeLogSchema,
} from '@graba25-be/providers/databases/db/schemas/time-log.schema';
import { UserSchema } from '@graba25-be/providers/databases/db/schemas/user.schema';
import { ProjectDbService } from '@graba25-be/providers/databases/db/services/project-db.service';
import { TaskDbService } from '@graba25-be/providers/databases/db/services/task-db.service';
import { UserDbService } from '@graba25-be/providers/databases/db/services/user-db.service';
import { TimeLogDbService } from '@graba25-be/providers/databases/db/services/time-log-db.service';
// import { TimeLogDbService } from '@graba25-be/providers/databases/db/services/time-log-db.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'TimeLog', schema: TimeLogSchema },
      { name: 'Interval', schema: IntervalSchema },
    ]),
  ],
  providers: [TaskDbService, UserDbService, ProjectDbService, TimeLogDbService],
  exports: [TaskDbService, UserDbService, ProjectDbService, TimeLogDbService],
})
export class DbServicesModule {}

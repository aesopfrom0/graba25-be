import { Injectable } from '@nestjs/common';
import { BaseService } from '../providers/base.service';
import { TaskDbService } from '../providers/db-services/services/task-db.service';

@Injectable()
export class TasksService extends BaseService {
  constructor(private readonly taskDbService: TaskDbService) {
    super();
  }
  // readonly #task: Task = {
  //   id: 1,
  //   userId: 1,
  //   title: '',
  //   estAttempts: 1,
  //   actAttempts: 1,
  //   memo: '',
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // };

  // find(id): Task {
  //   this.logger.log(`id: ${id}`);
  //   return this.#task;
  // }

  async getTasks() {
    return await this.taskDbService.getTasks();
  }
}

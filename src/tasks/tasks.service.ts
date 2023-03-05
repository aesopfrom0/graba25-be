import { Injectable } from '@nestjs/common';
import { Task } from './model/task.model';
import { BaseService } from '../providers/base.service';

@Injectable()
export class TasksService extends BaseService {
  readonly #task: Task = {
    id: 1,
    userId: 1,
    title: '',
    estAttempts: 1,
    actAttempts: 1,
    memo: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  find(id): Task {
    this.logger.log(`id: ${id}`);
    return this.#task;
  }
}

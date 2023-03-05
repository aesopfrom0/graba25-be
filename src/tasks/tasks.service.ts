import { Injectable } from '@nestjs/common';
import { Task } from './model/task.model';
import { Field, Int } from '@nestjs/graphql';

@Injectable()
export class TasksService {
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

  find(): Task {
    return this.#task;
  }
}

import { Injectable } from '@nestjs/common';
import { BaseService } from '../providers/base.service';
import { TaskDbService } from '../providers/db-services/services/task-db.service';
import { GetTasksDto } from './dtos/get-tasks.dto';

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

  async getTasks(): Promise<GetTasksDto[]> {
    const results = await this.taskDbService.getTasks();
    const temp = results.map((result) => {
      console.log(result);
      return {
        title: result.title.title[0].plain_text,
        userId: result.userId.number,
        memo: result.memo?.rich_text[0]?.plain_text,
        actAttempts: result.actAttempts.number,
        estAttempts: result.estAttempts.number,
        createdAt: result.createdAt.created_time as string,
        updatedAt: result.updatedAt.last_edited_time,
      };
    });
    return temp;
  }

  async createTask() {}
}

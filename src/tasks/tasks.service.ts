import { Injectable } from '@nestjs/common';
import { BaseService } from '../providers/base.service';
import { TaskDbService } from '../providers/db-services/services/task-db.service';
import { GetTaskDto, BaseTaskDto, UpdateTaskDto } from './dtos/base-task.dto';
import { BaseResponseDto } from '../shared/dtos/base-response.dto';

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

  async getTasks(): Promise<GetTaskDto[]> {
    return await this.taskDbService.getTasks();
  }

  async createTask(dto: BaseTaskDto): Promise<BaseResponseDto> {
    return await this.taskDbService.createTask(dto);
  }

  async updateTask(dto: UpdateTaskDto): Promise<BaseResponseDto> {
    return await this.taskDbService.updateTask(dto);
  }

  async deleteTask(id: string): Promise<BaseResponseDto> {
    return await this.taskDbService.deleteTask(id);
  }
}

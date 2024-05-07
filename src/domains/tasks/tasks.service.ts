import { Injectable } from '@nestjs/common';
import { BaseService } from '../../providers/base.service';
import { BaseTaskDto, UpdateTaskDto, UpdateTaskMongoDbDto } from '../../shared/dtos/base-task.dto';
import { TaskDbService } from 'src/providers/databases/db/services/task-db.service';
import { TaskResponseDto, TasksResponseDto } from 'src/shared/dtos/responses/task-response.dto';

@Injectable()
export class TasksService extends BaseService {
  constructor(private readonly taskDbService: TaskDbService) {
    super();
  }

  async getTasks(includeArchived: boolean): Promise<TasksResponseDto> {
    return await this.taskDbService.readTasks(includeArchived);
  }

  async task(id: string): Promise<TaskResponseDto> {
    return await this.taskDbService.readTask(id);
  }

  async createTask(dto: BaseTaskDto): Promise<TaskResponseDto> {
    return await this.taskDbService.createTask(dto);
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    return await this.taskDbService.updateTask(id, dto);
  }

  async archiveTask(id: string): Promise<TaskResponseDto> {
    return await this.taskDbService.archiveTask(id);
  }

  async archiveTasks(tasks: UpdateTaskMongoDbDto[]) {
    const tasksToBeArchived = await Promise.all(
      tasks.map(async (task) => {
        return { ...task, isArchived: true };
      }),
    );
    return await this.taskDbService.updateTasks(tasksToBeArchived);
  }
}

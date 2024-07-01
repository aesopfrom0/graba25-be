import { Injectable } from '@nestjs/common';
import { BaseService } from '../../providers/base.service';
import { BaseTaskDto, UpdateTaskDto } from '../../shared/dtos/base-task.dto';
import { TaskDbService } from 'src/providers/databases/db/services/task-db.service';
import { TaskResponseDto, TasksResponseDto } from 'src/shared/dtos/responses/task-response.dto';

@Injectable()
export class TasksService extends BaseService {
  constructor(private readonly taskDbService: TaskDbService) {
    super();
  }

  async getTasks(userId: string, includeArchived: boolean): Promise<TasksResponseDto> {
    return await this.taskDbService.readTasks(userId, includeArchived);
  }

  async getAllFinishedTasksBetween(gteDate: Date, ltDate: Date, userId?: string) {
    return await this.taskDbService.readAllFinishedTasksBetween(gteDate, ltDate, userId);
  }

  async task(id: string): Promise<TaskResponseDto> {
    return await this.taskDbService.readTask(id);
  }

  async createTask(dto: BaseTaskDto): Promise<TaskResponseDto> {
    this.logger.debug(`[${this.createTask.name}] Creating task: ${JSON.stringify(dto)}`);
    return await this.taskDbService.createTask(dto);
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    return await this.taskDbService.updateTask(id, dto);
  }

  async archiveTask(id: string): Promise<TaskResponseDto> {
    return await this.taskDbService.archiveTask(id);
  }

  async archiveTasks(userId: string, taskIds: string[]): Promise<string> {
    this.logger.debug(
      `[${this.archiveTasks.name}] user(${userId}) Archiving tasks: ${taskIds.toString()}`,
    );

    return await this.taskDbService.updateTasks(taskIds, { isArchived: true });
  }
}

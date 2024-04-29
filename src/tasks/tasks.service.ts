import { Injectable } from '@nestjs/common';
import { BaseService } from '../providers/base.service';
import { BaseTaskDto, UpdateTaskMongoDbDto } from '../shared/dtos/base-task.dto';
import { BaseResponseDto } from '../shared/dtos/base-response.dto';
import { CreateTimeLogDto } from '../shared/dtos/time-log.dto';
import { TimeLogNotionDbService } from 'src/providers/databases/notion/services/time-log-notion-db.service';
import { TaskDbService } from 'src/providers/databases/mongodb/services/task-db.service';
import { TaskResponseDto, TasksResponseDto } from 'src/shared/dtos/responses/task-response.dto';
import { isNil } from 'lodash';

@Injectable()
export class TasksService extends BaseService {
  constructor(
    private readonly timeLogDbService: TimeLogNotionDbService,
    private readonly taskDbService: TaskDbService,
  ) {
    super();
  }

  async getTasks(includeArchived: boolean): Promise<BaseResponseDto<TasksResponseDto>> {
    return await this.taskDbService.readTasks(includeArchived);
  }

  async createTask(dto: BaseTaskDto): Promise<BaseResponseDto<TaskResponseDto>> {
    return await this.taskDbService.createTask({ ...dto });
  }

  async updateTask(dto: UpdateTaskMongoDbDto): Promise<BaseResponseDto<string>> {
    return await this.taskDbService.updateTask(dto);
  }

  async archiveTask(id: string): Promise<BaseResponseDto<string>> {
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

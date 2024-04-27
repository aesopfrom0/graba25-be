import { Injectable } from '@nestjs/common';
import { BaseService } from '../providers/base.service';
import { TaskNotionDbService } from '../providers/databases/notion/services/task-notion-db.service';
import { BaseTaskDto, UpdateTaskDto, UpdateTaskMongoDbDto } from './dtos/base-task.dto';
import { BaseResponseDto } from '../shared/dtos/base-response.dto';
import { CreateTimeLogDto } from './dtos/time-log.dto';
import { TimeLogNotionDbService } from 'src/providers/databases/notion/services/time-log-notion-db.service';
import { TaskDbService } from 'src/providers/databases/mongodb/services/task-db.service';
import { TaskResponseDto, TasksResponseDto } from 'src/tasks/dtos/responses/task-response.dto';
import { isNil } from 'lodash'; // Import the isNil function from the correct location

@Injectable()
export class TasksService extends BaseService {
  constructor(
    private readonly taskNotionDbService: TaskNotionDbService,
    private readonly timeLogDbService: TimeLogNotionDbService,
    private readonly taskDbService: TaskDbService,
  ) {
    super();
  }

  async getTasks(includeArchived: boolean): Promise<BaseResponseDto<TasksResponseDto>> {
    return await this.taskDbService.readTasks(includeArchived);
  }

  async createTask(dto: BaseTaskDto): Promise<BaseResponseDto<TaskResponseDto>> {
    // notion db 추가
    const notionResult = await this.taskNotionDbService.createTask(dto);

    return await this.taskDbService.createTask({ ...dto, notionPageId: notionResult.body?.pageId });
  }

  async updateTask(dto: UpdateTaskMongoDbDto): Promise<BaseResponseDto<string>> {
    // get task from db
    const { id, ...rest } = dto;
    const task = (await this.taskDbService.readTask(id))?.body;

    if (!isNil(task?.notionPageId)) {
      await this.taskNotionDbService.updateTask({ ...rest, pageId: task?.notionPageId });
    }

    return await this.taskDbService.updateTask(dto);
  }

  async deleteTask(id: string): Promise<BaseResponseDto<string>> {
    return await this.taskNotionDbService.deleteTask(id);
  }

  async archiveTasks(tasks: UpdateTaskDto[]) {
    const tasksToBeArchived = tasks.map((task) => ({ ...task, isArchived: true }));
    return await this.taskNotionDbService.updateTasks(tasksToBeArchived);
  }

  async getAllBlocks(id: string) {
    return await this.taskNotionDbService.getAllBlocks(id);
  }

  async setCurrentTask(taskId: string): Promise<BaseResponseDto<string>> {
    try {
      const prevTask = await this.taskNotionDbService.getCurrentTask();
      if (prevTask) {
        await this.taskNotionDbService.updateTask({ ...prevTask, isCurrentTask: false });
      }
      await this.taskNotionDbService.updateTask({ pageId: taskId, isCurrentTask: true });
      return {
        ok: true,
        body: 'set the current task and released the previously focused task.',
      };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async createTimeLog(dto: CreateTimeLogDto) {
    return await this.timeLogDbService.createTimeLog(dto);
  }
}

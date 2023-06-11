import { Injectable } from '@nestjs/common';
import { BaseService } from '../providers/base.service';
import { TaskDbService } from '../providers/db-services/services/task-db.service';
import { GetTaskDto, BaseTaskDto, UpdateTaskDto, ArchiveTaskDto } from './dtos/base-task.dto';
import { BaseResponseDto } from '../shared/dtos/base-response.dto';
import { BaseTimeLogDto } from './dtos/time-log.dto';
import { TimeLogDbService } from 'src/providers/db-services/services/time-log-db.service';

@Injectable()
export class TasksService extends BaseService {
  constructor(private readonly taskDbService: TaskDbService, private readonly timeLogDbService: TimeLogDbService) {
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

  async getTasks(includeArchived: boolean): Promise<GetTaskDto[]> {
    return await this.taskDbService.getTasks(includeArchived);
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

  async archiveTasks(tasks: UpdateTaskDto[]) {
    const tasksToBeArchived = tasks.map((task) => ({ ...task, isArchived: true }));
    return await this.taskDbService.updateTasks(tasksToBeArchived);
  }

  async getAllBlocks(id: string) {
    return await this.taskDbService.getAllBlocks(id);
  }

  async setCurrentTask(taskId: string): Promise<BaseResponseDto> {
    try {
      const prevTask = await this.taskDbService.getCurrentTask();
      if (prevTask) {
        await this.taskDbService.updateTask({ ...prevTask, isCurrentTask: false });
      }
      await this.taskDbService.updateTask({ id: taskId, isCurrentTask: true });
      return {
        ok: true,
        message: 'set the current task and released the previously focused task.',
      };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async createTimeLog(dto: BaseTimeLogDto) {
    return await this.timeLogDbService.createTimeLog(dto);
  }
}

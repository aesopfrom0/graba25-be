import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseService } from 'src/providers/base.service';
import { Task } from 'src/providers/databases/mongodb/schemas/task.schema';
import { BaseResponseDto } from 'src/shared/dtos/base-response.dto';
import { CreateTaskBodyDto, UpdateTaskMongoDbDto } from 'src/tasks/dtos/base-task.dto';
import { TaskResponseDto } from 'src/tasks/dtos/responses/task-response.dto';

export class TaskDbService extends BaseService {
  constructor(@InjectModel('Task') private readonly taskModel: mongoose.Model<Task>) {
    super();
  }

  async createTask(dto: CreateTaskBodyDto): Promise<BaseResponseDto<TaskResponseDto>> {
    try {
      const task = new this.taskModel({
        title: dto.title,
        memo: dto.memo ?? '',
        actAttempts: dto.actAttempts,
        estAttempts: dto.estAttempts,
        notionPageId: dto.notionPageId,
      });
      const resp = await task.save();
      return { ok: true, body: new TaskResponseDto(resp) };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async readTask(id: string): Promise<BaseResponseDto<TaskResponseDto>> {
    try {
      const task = await this.taskModel.findById(id);
      if (!task) {
        return { ok: false, error: 'Task not found' };
      }
      return { ok: true, body: new TaskResponseDto(task) };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async readTasks(
    includeArchived: boolean,
  ): Promise<BaseResponseDto<{ count: number; rows: TaskResponseDto[] }>> {
    try {
      const filter = includeArchived ? {} : { isArchived: false };
      const tasks = (await this.taskModel.find(filter)).map((task) => new TaskResponseDto(task));
      const count = await this.taskModel.countDocuments();
      return { ok: true, body: { count, rows: tasks } };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async updateTask(dto: UpdateTaskMongoDbDto): Promise<BaseResponseDto<string>> {
    try {
      const task = await this.taskModel.findById(dto.id);
      if (!task) {
        return { ok: false, error: 'Task not found' };
      }
      Object.entries(dto).forEach(([key, value]) => {
        if (key !== 'id' && value !== undefined) {
          task[key] = value;
        }
      });
      const resp = await task.save();
      return { ok: true, body: resp.id };
    } catch (e) {
      this.logger.error(`[${this.updateTask.name}] Error: ${e}`);
      return { ok: false, error: JSON.stringify(e) };
    }
  }

  async updateTasks(tasks: UpdateTaskMongoDbDto[]): Promise<BaseResponseDto<string>> {
    let ok = true;
    let notUpdatedTaskIds = '';
    try {
      await Promise.all(
        tasks.map(async (task) => {
          const resp = await this.updateTask(task);
          if (!resp.ok) {
            ok = false;
            notUpdatedTaskIds = notUpdatedTaskIds.concat(`,${task.id}`);
          }
        }),
      );
      return { ok, body: `${tasks.length} tasks successfully updated` };
    } catch (e) {
      this.logger.error(e);
      return { ok: false, error: 'notUpdatedTaskIds' + notUpdatedTaskIds + JSON.stringify(e) };
    }
  }

  async archiveTask(id: string) {
    return await this.updateTask({ id, isArchived: true });
  }
}

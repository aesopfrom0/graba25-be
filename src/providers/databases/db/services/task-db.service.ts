import ApplicationException from '@graba25-be/shared/excenptions/application.exception';
import { ErrorCode } from '@graba25-be/shared/excenptions/error-code';
import { BadRequestException, InternalServerErrorException, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseService } from 'src/providers/base.service';
import { Task } from 'src/providers/databases/db/schemas/task.schema';
import { BaseTaskDto, UpdateTaskDto, UpdateTaskMongoDbDto } from 'src/shared/dtos/base-task.dto';
import { TaskResponseDto } from 'src/shared/dtos/responses/task-response.dto';

export class TaskDbService extends BaseService {
  constructor(@InjectModel('Task') private readonly taskModel: mongoose.Model<Task>) {
    super();
  }

  async createTask(dto: BaseTaskDto): Promise<TaskResponseDto> {
    try {
      const task = new this.taskModel(dto);
      const resp = await task.save();
      return new TaskResponseDto(resp);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async readTask(id: string): Promise<TaskResponseDto> {
    try {
      const task = await this.taskModel.findById(id);
      if (!task) {
        throw new ApplicationException(
          new BadRequestException('Task not found'),
          ErrorCode.TASK_NOT_FOUND,
        );
      }
      return new TaskResponseDto(task);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async readTasks(includeArchived: boolean): Promise<{ count: number; rows: TaskResponseDto[] }> {
    try {
      const filter = includeArchived ? {} : { isArchived: false };
      const tasks = (await this.taskModel.find(filter)).map((task) => new TaskResponseDto(task));
      const count = await this.taskModel.countDocuments();
      return { count, rows: tasks };
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    try {
      const task = await this.taskModel.findByIdAndUpdate(id, dto, { new: true });
      if (!task) {
        throw new ApplicationException(
          new BadRequestException('Task not found'),
          ErrorCode.TASK_NOT_FOUND,
        );
      }
      return new TaskResponseDto(task);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async updateTasks(tasks: UpdateTaskMongoDbDto[]): Promise<string> {
    let notUpdatedTaskIds = '';
    try {
      await Promise.all(
        tasks.map(async (task) => {
          const { id, ...rest } = task;
          const resp = await this.updateTask(id, rest);
          if (!resp) {
            notUpdatedTaskIds = notUpdatedTaskIds.concat(`,${id}`);
          }
        }),
      );
      return `${tasks.length} tasks successfully updated`;
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async archiveTask(id: string): Promise<TaskResponseDto> {
    return await this.updateTask(id, { isArchived: true });
  }
}
import ApplicationException from '@graba25-be/shared/exceptions/application.exception';
import { ErrorCode } from '@graba25-be/shared/exceptions/error-code';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseService } from 'src/providers/base.service';
import { Task } from 'src/providers/databases/db/schemas/task.schema';
import { BaseTaskDto, UpdateTaskDto } from 'src/shared/dtos/base-task.dto';
import {
  TaskGroupedByUserResponseDto,
  TaskResponseDto,
} from 'src/shared/dtos/responses/task-response.dto';

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

  async readTasks(
    userId: string,
    includeArchived: boolean,
  ): Promise<{ count: number; rows: TaskResponseDto[] }> {
    try {
      const defaultFilter = { user: userId };
      const filter = includeArchived ? defaultFilter : { ...defaultFilter, isArchived: false };
      const tasks = (await this.taskModel.find(filter)).map((task) => new TaskResponseDto(task));
      const count = await this.taskModel.countDocuments(filter);
      return { count, rows: tasks };
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TaskDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async readAllFinishedTasksBetween(
    gteDate: Date,
    ltDate: Date,
  ): Promise<TaskGroupedByUserResponseDto[]> {
    try {
      const tasks = await this.taskModel.aggregate([
        {
          $match: {
            isFinished: true,
            finishedAt: { $gte: gteDate, $lt: ltDate },
          },
        },
        {
          $group: {
            _id: '$user',
            totalFinishedTasks: { $sum: 1 }, // 완료된 작업 수 계산
          },
        },
      ]);

      return tasks.map((group) => ({
        userId: group._id.toString(),
        totalFinishedTasks: group.totalFinishedTasks,
      }));
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

  async updateTasks(taskIds: string[], dto: UpdateTaskDto): Promise<string> {
    try {
      const result = await this.taskModel.updateMany({ _id: { $in: taskIds } }, dto);
      const { modifiedCount, matchedCount } = result;
      return `${modifiedCount}/${matchedCount} tasks updated`;
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

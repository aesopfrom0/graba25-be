import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BaseTaskDto, UpdateTaskDto, UpdateTaskMongoDbDto } from '../shared/dtos/base-task.dto';
import { BaseResponseDto } from '../shared/dtos/base-response.dto';
import { TaskResponseDto, TasksResponseDto } from 'src/shared/dtos/responses/task-response.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query('includeArchived', new DefaultValuePipe(false), ParseBoolPipe) includeArchived: boolean,
  ): Promise<BaseResponseDto<TasksResponseDto>> {
    return await this.tasksService.getTasks(includeArchived);
  }

  @Post()
  async createTask(@Body() taskDto: BaseTaskDto): Promise<BaseResponseDto<TaskResponseDto>> {
    return await this.tasksService.createTask(taskDto);
  }

  @Patch('archive')
  async archiveTasks(
    @Body() archiveTasks: UpdateTaskMongoDbDto[],
  ): Promise<BaseResponseDto<string>> {
    return await this.tasksService.archiveTasks(archiveTasks);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() taskDto: UpdateTaskDto,
  ): Promise<BaseResponseDto<string>> {
    return await this.tasksService.updateTask({ ...taskDto, id });
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<BaseResponseDto<string>> {
    return await this.tasksService.archiveTask(id);
  }
}

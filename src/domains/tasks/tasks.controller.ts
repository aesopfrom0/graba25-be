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
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskBodyDto, UpdateTaskDto } from '../../shared/dtos/base-task.dto';
import {
  TaskResponseDto,
  TasksResponseDto,
} from '@graba25-be/shared/dtos/responses/task-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from '@graba25-be/shared/decorators/user-id.decorator';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(
    @UserId() userId: string,
    @Query('includeArchived', new DefaultValuePipe(false), ParseBoolPipe) includeArchived: boolean,
  ): Promise<TasksResponseDto> {
    return await this.tasksService.getTasks(userId, includeArchived);
  }

  @Get(':id')
  async getTask(@Param('id') id: string): Promise<TaskResponseDto> {
    return await this.tasksService.task(id);
  }

  @Post()
  async createTask(
    @UserId() userId: string,
    @Body() taskDto: CreateTaskBodyDto,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.createTask({ ...taskDto, user: userId });
  }

  @Patch('archive')
  async archiveTasks(
    @UserId() userId: string,
    @Body('taskIds') taskIds: string[],
  ): Promise<string> {
    return await this.tasksService.archiveTasks(userId, taskIds);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() taskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.updateTask(id, taskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<TaskResponseDto> {
    return await this.tasksService.archiveTask(id);
  }
}

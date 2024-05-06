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
import {
  CreateTaskBodyDto,
  UpdateTaskDto,
  UpdateTaskMongoDbDto,
} from '../../shared/dtos/base-task.dto';
import {
  TaskResponseDto,
  TasksResponseDto,
} from '@graba25-be/shared/dtos/responses/task-response.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query('includeArchived', new DefaultValuePipe(false), ParseBoolPipe) includeArchived: boolean,
  ): Promise<TasksResponseDto> {
    console.log(await this.tasksService.getTasks(includeArchived));
    return await this.tasksService.getTasks(includeArchived);
  }

  @Post()
  async createTask(@Body() taskDto: CreateTaskBodyDto): Promise<TaskResponseDto> {
    console.log(taskDto);
    return await this.tasksService.createTask({ ...taskDto, user: '66390a7780187ab746aaccd6' }); // todo: 유저 id 데코레이터 적용
  }

  @Patch('archive')
  async archiveTasks(@Body() archiveTasks: UpdateTaskMongoDbDto[]): Promise<string> {
    return await this.tasksService.archiveTasks(archiveTasks);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() taskDto: UpdateTaskDto): Promise<string> {
    return await this.tasksService.updateTask({ ...taskDto, id });
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<string> {
    return await this.tasksService.archiveTask(id);
  }
}

import { Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GetTasksDto } from './dtos/get-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(): Promise<GetTasksDto[]> {
    return await this.tasksService.getTasks();
  }

  @Post()
  async createTask(): Promise<any> {}
}

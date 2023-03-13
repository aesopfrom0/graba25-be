import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTaskInput, Task } from './model/task.model';
import { TasksService } from './tasks.service';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  // example query
  @Query(() => Task)
  async task(@Args('id', { type: () => Int }) id: number): Promise<Task | null> {
    // fetch task from database using the id
    // return the task as an instance of the Task class
    return await this.tasksService.findTask(id);
  }

  @Mutation(() => Task)
  async createTask(@Args('task') taskInput: CreateTaskInput) {
    return await this.tasksService.createTask(taskInput);
  }
}

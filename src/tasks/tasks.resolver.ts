import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Task } from './model/task.model';
import { TasksService } from './tasks.service';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  // example query
  @Query(() => Task)
  async task(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    // fetch task from database using the id
    // return the task as an instance of the Task class
    return this.tasksService.find(id);
  }

  // // example mutation
  // @Mutation(() => Task)
  // async createTask(@Args('task') task: Task): Promise<Task> {
  //   // save the task to the database
  //   // return the task as an instance of the Task class
  // }
}

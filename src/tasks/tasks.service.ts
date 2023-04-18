import { Injectable } from '@nestjs/common';
import { CreateTaskInput, Task } from './model/task.model';
import { BaseService } from '../providers/base.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService extends BaseService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<Task>,
  ) {
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

  async findTask(id: number): Promise<Task | null> {
    return await this.tasksRepository.findOneBy({ id });
  }

  async findTasksByUser(userId: number): Promise<Task[]> {
    return await this.tasksRepository.find({ where: { userId }});
  }

  async createTask(inputDto: CreateTaskInput): Promise<Task> {
    const task = await this.tasksRepository.create(inputDto);
    await this.tasksRepository.save(task);
    this.logger.debug(`inputDto: ${JSON.stringify(inputDto)}`);
    return task;
  }
}

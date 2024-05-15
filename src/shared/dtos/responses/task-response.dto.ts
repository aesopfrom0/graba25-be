import { ApiProperty } from '@nestjs/swagger';
import { Task } from 'src/providers/databases/db/schemas/task.schema';

export class TaskResponseDto {
  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.memo = task.memo;
    this.actAttempts = task.actAttempts;
    this.estAttempts = task.estAttempts;
    this.isFinished = task.isFinished;
    this.isArchived = task.isArchived;
    this.isCurrentTask = task.isCurrentTask;
    this.dueDate = task.dueDate;
    this.notionPageId = task.notionPageId;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
  }

  @ApiProperty({ example: '60f7ea20d46a3f1e4c3d6e0a', description: 'Task id' })
  id!: string;

  @ApiProperty({ example: 'Task title', description: 'Task title' })
  title!: string;

  @ApiProperty({ example: 'Task memo', description: 'Task memo', required: false })
  memo?: string;

  @ApiProperty({ example: 0, description: 'Actual attempts of task' })
  actAttempts!: number;

  @ApiProperty({ example: 1, description: 'Estimated attempts of task' })
  estAttempts!: number;

  @ApiProperty({ example: false, description: 'If the task is finished' })
  isFinished!: boolean;

  @ApiProperty({ example: false, description: 'If the task is archived' })
  isArchived!: boolean;

  @ApiProperty({ example: false, description: 'If it is the current task' })
  isCurrentTask!: boolean;

  @ApiProperty({
    example: '2022-07-20T09:00:00.000Z',
    description: 'Due date of task',
    required: false,
  })
  dueDate?: Date;

  @ApiProperty({
    example: '60f7ea20d46a3f1e4c3d6e0a',
    description: 'Notion page id',
    required: false,
  })
  notionPageId?: string;

  @ApiProperty({ example: '2022-07-20T09:00:00.000Z', description: 'Created date of task' })
  createdAt!: Date;

  @ApiProperty({ example: '2022-07-20T09:00:00.000Z', description: 'Updated date of task' })
  updatedAt!: Date;
}

export class TasksResponseDto {
  count!: number;
  rows!: TaskResponseDto[];
}

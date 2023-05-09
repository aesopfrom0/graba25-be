export class CreateTaskBodyDto {
  title!: string;
  memo?: string;
  actAttempts: number = 0;
  estAttempts: number = 1;
}

export class BaseTaskDto extends CreateTaskBodyDto {
  userId!: number;
}

export class GetTaskDto extends BaseTaskDto {
  id!: string;
  isFinished!: boolean;
  isArchived!: boolean;
  createdAt!: string;
  updatedAt!: string;
}

export class UpdateTaskDto {
  id!: string;
  title?: string;
  memo?: string;
  isFinished?: boolean;
  isArchived?: boolean;
  actAttempts?: number;
  estAttempts?: number;
}

export class ArchiveTaskDto {
  id!: string;
  isFinished!: boolean;
  isArchived!: boolean;
}

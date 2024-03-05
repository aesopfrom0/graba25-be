export class CreateTaskBodyDto {
  title!: string;
  memo?: string;
  actAttempts = 0;
  estAttempts = 1;
}

export class BaseTaskDto extends CreateTaskBodyDto {
  userId?: number;
}

export class GetTaskDto extends BaseTaskDto {
  id!: string;
  isFinished!: boolean;
  isArchived!: boolean;
  isCurrentTask?: boolean;
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
  isCurrentTask?: boolean;
}

export class getCurrentTaskDto {
  id!: string;
  isCurrentTask!: string;
}

export class ArchiveTaskDto {
  id!: string;
  isFinished!: boolean;
  isArchived!: boolean;
}

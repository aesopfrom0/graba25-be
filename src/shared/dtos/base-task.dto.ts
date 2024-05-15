export class CreateTaskBodyDto {
  title!: string;
  memo?: string;
  actAttempts = 0;
  estAttempts = 1;
  notionPageId?: string;
}

export class BaseTaskDto extends CreateTaskBodyDto {
  user?: string;
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
  title?: string;
  memo?: string;
  isFinished?: boolean;
  isArchived?: boolean;
  actAttempts?: number;
  estAttempts?: number;
  pageId?: string;
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

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
  createdAt!: string;
  updatedAt!: string;
}

export class UpdateTaskDto {
  id!: string;
  title?: string;
  memo?: string;
  actAttempts?: number;
  estAttempts?: number;
}

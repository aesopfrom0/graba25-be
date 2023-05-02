export class GetTasksDto {
  title!: string;
  userId!: number;
  memo?: string;
  actAttempts!: number;
  estAttempts!: number;
  createdAt!: string;
  updatedAt!: string;
}

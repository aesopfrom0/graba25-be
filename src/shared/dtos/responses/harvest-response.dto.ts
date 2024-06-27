export class HarvestResponseDto {
  id!: string;
  userId!: string;
  date!: number; // YYYYMMDD
  pomodoros!: number;
  tasksCompleted!: number;
  hoursInvested!: string;
  // createdAt!: string;
  // updatedAt!: string;
}

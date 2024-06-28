export class HarvestResponseDto {
  id!: string;
  userId!: string;
  date!: number; // YYYYMMDD
  pomodoros!: number;
  tasksCompleted!: number;
  secondsInvested!: number;
  // createdAt!: string;
  // updatedAt!: string;
}

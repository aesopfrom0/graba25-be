export class HarvestResponseDto {
  id!: string;
  userId!: string;
  date!: string; // YYYY-MM-DD
  pomodoros!: number;
  tasksCompleted!: number;
  secondsInvested!: number;
  // createdAt!: string;
  // updatedAt!: string;
}

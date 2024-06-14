export class HarvestResponseDto {
  id!: string;
  userId!: string;
  date!: string; // YYMMDD
  pomodoros!: number;
  tasksCompleted!: number;
  hoursInvested!: string;
  // createdAt!: string;
  // updatedAt!: string;
}

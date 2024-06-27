export class CreateHarvestRequestDto {
  userId!: string;
  date!: number; // YYYYMMDD
  pomodoros!: number;
  tasksCompleted!: number;
  secondsInvested!: number;
}

export class CreateHarvestRequestDto {
  userId!: string;
  date!: string; // YYMMDD
  pomodoros!: number;
  tasksCompleted!: number;
  secondsInvested!: number;
}

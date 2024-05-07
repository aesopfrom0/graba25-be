export class CreateTimeLogRequestDto {
  user!: string;
  attemptN!: number;
  task!: string;
  start!: Date;
}

export class StartIntervalRequestDto {
  start!: Date;
}

export class EndIntervalRequestDto {
  end!: Date;
}

export class FinishTimeLogRequestDto {
  end!: Date;
  isFinished!: boolean;
}

export class UpdateTimeLogRequestDto {
  isFinished?: boolean;
  newInterval?: { start: Date; end?: Date };
}

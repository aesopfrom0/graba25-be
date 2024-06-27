import { Interval, TimeLog } from '@graba25-be/providers/databases/db/schemas/time-log.schema';
import { TaskResponseDto } from '@graba25-be/shared/dtos/responses/task-response.dto';
import { ValidateNested } from 'class-validator';

export class IntervalResponseDto {
  constructor(interval: any) {
    this.id = interval.id;
    this.start = interval.start;
    this.end = interval.end;
  }
  id!: string;
  start: Date;
  end?: Date;
}

export class TimeLogResponseDto {
  constructor(timeLog: TimeLog) {
    this.id = timeLog.id;
    this.isFinished = timeLog.isFinished;
    this.attemptN = timeLog.attemptN;
    this.createdAt = timeLog.createdAt;
    this.updatedAt = timeLog.updatedAt;
    this.user = timeLog.user.toString();
    this.task = new TaskResponseDto(timeLog.task);
    this.intervals = timeLog.intervals?.map((interval) => new IntervalResponseDto(interval));
  }

  id!: string;
  isFinished!: boolean;
  attemptN!: number;
  createdAt!: Date;
  updatedAt!: Date;

  user!: string;

  @ValidateNested()
  task!: TaskResponseDto;

  @ValidateNested()
  intervals?: Interval[];
}

export class TimeLogGroupedByUserResponseDto {
  totalPomodoros!: number;
  totalSecondsInvested!: number;
  userId!: string;
  displayName!: string;
  email!: string;
}

import { IsDateString, IsOptional, ValidateNested } from 'class-validator';

class DateTimeRange {
  @IsDateString()
  start!: string;
  @IsOptional()
  @IsDateString()
  end?: string;
}

export class BaseTimeLogDto {
  userId = 1;
  durationSecs!: number;
  @ValidateNested()
  dateTimeRange!: DateTimeRange;
}

export class CreateTimeLogDto extends BaseTimeLogDto {
  taskId!: string;
}

export class GetTimeLogDto extends BaseTimeLogDto {
  id!: string;
  task!: {
    id: string;
    title: string;
  };
}

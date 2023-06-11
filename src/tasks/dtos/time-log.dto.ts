import { IsDateString, IsOptional, ValidateNested } from 'class-validator';

class DateTimeRange {
  @IsDateString()
  start!: string;
  @IsOptional()
  @IsDateString()
  end?: string;
}

export class BaseTimeLogDto {
  taskId!: string;
  userId = 1;
  durationSecs!: number;
  @ValidateNested()
  dateTimeRange!: DateTimeRange;
}

export class GetTimeLogDto extends BaseTimeLogDto {
  id!: string;
}

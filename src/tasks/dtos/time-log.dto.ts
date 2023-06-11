import { IsDateString, IsOptional } from "class-validator";

export class BaseTimeLogDto {
  taskId!: string;
  userId = 1;
  durationSecs!: number;
  dateTimeRange!: DateTimeRange;
}

class DateTimeRange {
  @IsDateString()
  start!: string;
  @IsOptional()
  @IsDateString()
  end?: string;
}

export class GetTimeLogDto extends BaseTimeLogDto {
  id!: string;
}
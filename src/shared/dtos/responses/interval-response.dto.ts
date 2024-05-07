export class IntervalResponseDto {
  constructor(interval) {
    this.start = interval.start;
    this.end = interval.end;
  }

  start: Date;
  end?: Date;
}

import { Controller, Get } from '@nestjs/common';
import { TimeLogService } from '@graba25-be/domains/time-log/time-log.service';

@Controller()
export class AppController {
  constructor(private timeLogService: TimeLogService) {}

  @Get('test')
  async test() {
    return await this.timeLogService.getTimeLogsGroupedByUser('2024-05-14', '2024-06-15');
  }
}

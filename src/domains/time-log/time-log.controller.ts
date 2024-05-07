import { TimeLogService } from '@graba25-be/domains/time-log/time-log.service';
import {
  CreateTimeLogRequestDto,
  EndIntervalRequestDto,
  StartIntervalRequestDto,
} from '@graba25-be/shared/dtos/requests/time-log-request.dto';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('time-logs')
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}

  @Post()
  async createTimeLog(@Body() dto: CreateTimeLogRequestDto) {
    return await this.timeLogService.createTimeLog(dto);
  }

  @Get(':id')
  async getTimeLog(@Param('id') id: string) {
    return await this.timeLogService.timeLog(id);
  }

  @Get('intervals/:id')
  async getInterval(@Param('id') id: string) {
    return await this.timeLogService.interval(id);
  }

  @Post(':timeLogId/intervals')
  async createInterval(
    @Param('timeLogId') timeLogId: string,
    @Body() dto: StartIntervalRequestDto,
  ) {
    return await this.timeLogService.startInterval(dto, timeLogId);
  }

  @Patch('intervals/:intervalId/end')
  async endInterval(@Param('intervalId') intervalId: string, @Body() dto: EndIntervalRequestDto) {
    return await this.timeLogService.endInterval(intervalId, dto);
  }
}

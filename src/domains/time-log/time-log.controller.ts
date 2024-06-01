import { TimeLogService } from '@graba25-be/domains/time-log/time-log.service';
import { UserId } from '@graba25-be/shared/decorators/user-id.decorator';
import {
  CreateTimeLogRequestDto,
  EndIntervalRequestDto,
  StartIntervalRequestDto,
} from '@graba25-be/shared/dtos/requests/time-log-request.dto';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('time-logs')
@UseGuards(AuthGuard('jwt'))
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}

  @Post()
  async createTimeLog(@UserId() userId: string, @Body() dto: CreateTimeLogRequestDto) {
    return await this.timeLogService.createTimeLog(userId, dto);
  }

  @Get(':id')
  async getTimeLog(@Param('id') id: string) {
    return await this.timeLogService.timeLog(id);
  }

  @Patch(':id/finish')
  async finishTimeLog(@Param('id') id: string) {
    return await this.timeLogService.finishTimeLog(id);
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

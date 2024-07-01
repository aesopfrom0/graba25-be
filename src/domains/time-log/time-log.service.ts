import { BaseService } from '@graba25-be/providers/base.service';
import { TimeLogDbService } from '@graba25-be/providers/databases/db/services/time-log-db.service';
import {
  CreateTimeLogRequestDto,
  EndIntervalRequestDto,
  StartIntervalRequestDto,
} from '@graba25-be/shared/dtos/requests/time-log-request.dto';
import {
  TimeLogGroupedByUserResponseDto,
  TimeLogResponseDto,
} from '@graba25-be/shared/dtos/responses/time-log-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeLogService extends BaseService {
  constructor(private readonly timeLogDbService: TimeLogDbService) {
    super();
  }

  async createTimeLog(userId: string, dto: CreateTimeLogRequestDto) {
    this.logger.debug(
      `[${this.createTimeLog.name}] userId: ${userId}, Creating time log: ${JSON.stringify(dto)}`,
    );
    return await this.timeLogDbService.createTimeLog(userId, dto);
  }

  async timeLog(id: string): Promise<TimeLogResponseDto> {
    this.logger.debug(`[${this.timeLog.name}] Reading time log: ${id}`);
    return await this.timeLogDbService.readTimeLog(id);
  }

  async finishTimeLog(id: string): Promise<TimeLogResponseDto> {
    this.logger.debug(`[${this.finishTimeLog.name}] Finishing time log: ${id}`);
    return await this.timeLogDbService.updateTimeLog(id, { isFinished: true });
  }

  async interval(id: string) {
    this.logger.debug(`[${this.interval.name}] Reading interval: ${id}`);
    return await this.timeLogDbService.readInterval(id);
  }

  async startInterval(dto: StartIntervalRequestDto, timeLogId: string) {
    this.logger.debug(`[${this.startInterval.name}] Starting interval for time log: ${timeLogId}`);
    return await this.timeLogDbService.createInterval(dto, timeLogId);
  }

  async endInterval(intervalId: string, dto: EndIntervalRequestDto) {
    this.logger.debug(`[${this.endInterval.name}] Ending interval: ${intervalId}`);
    return await this.timeLogDbService.updateInterval(intervalId, dto);
  }

  async getTimeLogsGroupedByUser(
    startDate: string,
    endDate: string,
    userId?: string,
  ): Promise<TimeLogGroupedByUserResponseDto[]> {
    this.logger.debug(`[${this.getTimeLogsGroupedByUser.name}] Getting time logs grouped by user`);
    return await this.timeLogDbService.getTimeLogsGroupedByUser(
      new Date(startDate),
      new Date(endDate),
      userId,
    );
  }
}

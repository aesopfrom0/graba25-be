import { BaseService } from '@graba25-be/providers/base.service';
import { TimeLogDbService } from '@graba25-be/providers/databases/db/services/time-log-db.service';
import {
  CreateTimeLogRequestDto,
  EndIntervalRequestDto,
  StartIntervalRequestDto,
} from '@graba25-be/shared/dtos/requests/time-log-request.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeLogService extends BaseService {
  constructor(private readonly timeLogDbService: TimeLogDbService) {
    super();
  }

  async createTimeLog(dto: CreateTimeLogRequestDto) {
    this.logger.debug(`[${this.createTimeLog.name}] Creating time log: ${JSON.stringify(dto)}`);
    return await this.timeLogDbService.createTimeLog(dto);
  }

  async timeLog(id: string) {
    this.logger.debug(`[${this.timeLog.name}] Reading time log: ${id}`);
    return await this.timeLogDbService.readTimeLog(id);
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
}

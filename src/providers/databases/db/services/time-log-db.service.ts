import { BaseService } from '@graba25-be/providers/base.service';
import { Interval, TimeLog } from '@graba25-be/providers/databases/db/schemas/time-log.schema';
import {
  CreateTimeLogRequestDto,
  EndIntervalRequestDto,
  StartIntervalRequestDto,
  UpdateTimeLogRequestDto,
} from '@graba25-be/shared/dtos/requests/time-log-request.dto';
import {
  IntervalResponseDto,
  TimeLogResponseDto,
} from '@graba25-be/shared/dtos/responses/time-log-resopnse.dto';
import ApplicationException from '@graba25-be/shared/exceptions/application.exception';
import { ErrorCode } from '@graba25-be/shared/exceptions/error-code';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class TimeLogDbService extends BaseService {
  constructor(
    @InjectModel('TimeLog') private readonly timeLogModel: Model<TimeLog>,
    @InjectModel('Interval') private readonly intervalModel: Model<Interval>,
  ) {
    super();
  }

  async createTimeLog(userId: string, dto: CreateTimeLogRequestDto): Promise<TimeLogResponseDto> {
    try {
      const { start, ...rest } = dto;
      const { id: timeLogId } = await this.intervalModel.create({ user: userId, start });
      const newTimeLog = new this.timeLogModel({ ...rest, user: userId, intervals: [timeLogId] });
      const { id } = await newTimeLog.save();
      if (!id) {
        throw new ApplicationException(
          new BadRequestException('Time log not found'),
          ErrorCode.TIME_LOG_NOT_FOUND,
        );
      }
      return await this.readTimeLog(id);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TimeLogDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async readTimeLog(id: string): Promise<TimeLogResponseDto> {
    try {
      const timeLog = await this.timeLogModel.findById(id).populate(['task', 'intervals']);
      if (!timeLog) {
        throw new ApplicationException(
          new BadRequestException('Time log not found'),
          ErrorCode.TIME_LOG_NOT_FOUND,
        );
      }
      return new TimeLogResponseDto(timeLog);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TimeLogDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async updateTimeLog(id: string, dto: UpdateTimeLogRequestDto): Promise<TimeLogResponseDto> {
    try {
      const updatedTimeLog = await this.timeLogModel.findByIdAndUpdate(id, dto, { new: true });
      if (!updatedTimeLog) {
        throw new ApplicationException(
          new BadRequestException('Time log not found'),
          ErrorCode.TIME_LOG_NOT_FOUND,
        );
      }
      return await this.readTimeLog(id);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TimeLogDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async createInterval(
    dto: StartIntervalRequestDto,
    timeLogId: string,
  ): Promise<IntervalResponseDto> {
    try {
      const interval = await this.intervalModel.create(dto);
      const timeLog = await this.timeLogModel.findById(timeLogId);
      if (!timeLog) {
        throw new ApplicationException(
          new BadRequestException('Time log not found'),
          ErrorCode.TIME_LOG_NOT_FOUND,
        );
      }
      timeLog.intervals.push(interval);
      await timeLog.save();
      return new IntervalResponseDto(interval);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TimeLogDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async readInterval(intervalId: string): Promise<IntervalResponseDto> {
    try {
      const interval = await this.intervalModel.findById(intervalId);
      if (!interval) {
        throw new ApplicationException(
          new BadRequestException('Interval not found'),
          ErrorCode.TIME_LOG_NOT_FOUND,
        );
      }
      return new IntervalResponseDto(interval);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TimeLogDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }

  async updateInterval(intervalId: string, dto: EndIntervalRequestDto) {
    try {
      const interval = await this.intervalModel.findByIdAndUpdate(intervalId, dto, { new: true });
      if (!interval) {
        throw new ApplicationException(
          new BadRequestException('Interval not found'),
          ErrorCode.TIME_LOG_NOT_FOUND,
        );
      }
      return await this.readInterval(intervalId);
    } catch (e) {
      this.logger.error(e);
      throw new ApplicationException(
        new InternalServerErrorException(TimeLogDbService.name),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }
}

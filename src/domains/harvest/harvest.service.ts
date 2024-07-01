import { TasksService } from '@graba25-be/domains/tasks/tasks.service';
import { TimeLogService } from '@graba25-be/domains/time-log/time-log.service';
import { BaseService } from '@graba25-be/providers/base.service';
import { HarvestDbService } from '@graba25-be/providers/databases/db/services/harvest-db.service';
import { HarvestQueryDto } from '@graba25-be/shared/dtos/queries/harvest-query.dto';
import { CreateHarvestRequestDto } from '@graba25-be/shared/dtos/requests/harvest-request.dto';
import { HarvestResponseDto } from '@graba25-be/shared/dtos/responses/harvest-response.dto';
import { TimeLogGroupedByUserResponseDto } from '@graba25-be/shared/dtos/responses/time-log-response.dto';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { create } from 'domain';

@Injectable()
export class HarvestService extends BaseService {
  constructor(
    private readonly harvestDbService: HarvestDbService,
    private readonly timeLogService: TimeLogService,
    private readonly tasksService: TasksService,
  ) {
    super();
  }

  async createHarvest(dto: CreateHarvestRequestDto): Promise<HarvestResponseDto> {
    const { userId, secondsInvested, date, id, pomodoros, tasksCompleted } =
      await this.harvestDbService.createHarvest(dto);
    return {
      id,
      userId,
      date: this.formatDate(date),
      secondsInvested,
      pomodoros,
      tasksCompleted,
    };
  }

  private async createBulkHarvests(dtos: CreateHarvestRequestDto[]): Promise<HarvestResponseDto[]> {
    const harvests = await this.harvestDbService.createBulkHarvests(dtos);
    return harvests.map((harvest) => ({
      id: harvest.id,
      userId: harvest.userId,
      date: this.formatDate(harvest.date),
      secondsInvested: harvest.secondsInvested,
      pomodoros: harvest.pomodoros,
      tasksCompleted: harvest.tasksCompleted,
    }));
  }

  private async extractHarvestData(
    date: string,
    userId?: string,
  ): Promise<CreateHarvestRequestDto[]> {
    const dateInDayjs = dayjs(date);
    const dateInNumber = +dateInDayjs.format('YYYYMMDD');

    // Fetch data to be processed for the day
    const dataToProcess = await this.fetchDataForDate(date, userId);
    const countFinishedTasks = await this.tasksService.getAllFinishedTasksBetween(
      dateInDayjs.toDate(),
      dateInDayjs.add(1, 'day').toDate(),
      userId,
    );

    // Process and create harvest records
    const userIdSet = new Set<string>();
    const result: CreateHarvestRequestDto[] = [];
    for (const data of dataToProcess) {
      const userId = data.userId;
      userIdSet.add(userId);
      const createHarvestDto: CreateHarvestRequestDto = {
        userId,
        date: dateInNumber,
        pomodoros: data.totalPomodoros,
        tasksCompleted:
          countFinishedTasks.find((task) => task.userId === userId)?.totalFinishedTasks || 0,
        secondsInvested: data.totalSecondsInvested,
      };
      result.push(createHarvestDto);
    }

    // Create harvest records for users who didn't have any time logs
    countFinishedTasks.forEach((user) => {
      if (!userIdSet.has(user.userId)) {
        result.push({
          userId: user.userId,
          date: dateInNumber,
          pomodoros: 0,
          tasksCompleted: user.totalFinishedTasks,
          secondsInvested: 0,
        });
      }
    });
    return result;
  }

  async processDailyHarvest(
    date: string,
  ): Promise<{ date: string; count: number; isNew: boolean }> {
    const dateInDayjs = dayjs(date);
    const dateInNumber = +dateInDayjs.format('YYYYMMDD');
    // Check if harvests for the date already exist
    const existingHarvest = await this.harvestDbService.readHarvestsByDate(dateInNumber);
    if (existingHarvest) {
      return { date, count: 0, isNew: false };
    }

    const createHarvestDtos = await this.extractHarvestData(date);

    await this.createBulkHarvests(createHarvestDtos);
    return { date, count: createHarvestDtos.length, isNew: true };
  }

  private async fetchDataForDate(
    date: string,
    userId?: string,
  ): Promise<TimeLogGroupedByUserResponseDto[]> {
    return await this.timeLogService.getTimeLogsGroupedByUser(
      dayjs(date).format(),
      dayjs(date).add(1, 'day').format(),
      userId,
    );
  }

  async harvests(userId: string, queryDto: HarvestQueryDto): Promise<HarvestResponseDto[]> {
    this.logger.debug(
      `[${this.harvests.name}] userId: ${userId}, queryDto: ${JSON.stringify(queryDto)}`,
    );
    const harvests = await this.harvestDbService.readHarvestsByUserId(userId, queryDto);
    const result = harvests.map((harvest) => ({
      id: harvest.id,
      userId: harvest.userId,
      date: this.formatDate(harvest.date),
      secondsInvested: harvest.secondsInvested,
      pomodoros: harvest.pomodoros,
      tasksCompleted: harvest.tasksCompleted,
    }));
    // 위 result의 마지막 날짜를 가져옴 (위 쿼리 변경 시 sort 필요)
    const lastDay = result[result.length - 1]?.date;
    const diff = Math.max(dayjs().diff(dayjs(lastDay), 'day') - 1, 0);
    const today = dayjs();
    for (let i = diff; i >= 0; i--) {
      const data = await this.extractHarvestData(
        today.subtract(i, 'day').format('YYYY-MM-DD'),
        userId,
      );
      if (data.length > 0) {
        data.forEach((harvest) => {
          result.push({
            id: randomUUID(),
            userId: harvest.userId.toString(),
            date: this.formatDate(harvest.date),
            secondsInvested: harvest.secondsInvested,
            pomodoros: harvest.pomodoros,
            tasksCompleted: harvest.tasksCompleted,
          });
        });
      }
    }

    return result;
  }

  private formatDate(dateNumber: number): string {
    const dateString = dateNumber.toString();
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}-${month}-${day}`;
  }
}

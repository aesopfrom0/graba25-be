import { TasksService } from '@graba25-be/domains/tasks/tasks.service';
import { TimeLogService } from '@graba25-be/domains/time-log/time-log.service';
import { BaseService } from '@graba25-be/providers/base.service';
import { HarvestDbService } from '@graba25-be/providers/databases/db/services/harvest-db.service';
import { CreateHarvestRequestDto } from '@graba25-be/shared/dtos/requests/harvest-request.dto';
import { HarvestResponseDto } from '@graba25-be/shared/dtos/responses/harvest-response.dto';
import { TimeLogGroupedByUserResponseDto } from '@graba25-be/shared/dtos/responses/time-log-response.dto';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

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
      date,
      hoursInvested: (secondsInvested / 3600).toFixed(2),
      pomodoros,
      tasksCompleted,
    };
  }

  private async createBulkHarvests(dtos: CreateHarvestRequestDto[]): Promise<HarvestResponseDto[]> {
    const harvests = await this.harvestDbService.createBulkHarvests(dtos);
    return harvests.map((harvest) => ({
      id: harvest.id,
      userId: harvest.userId,
      date: harvest.date,
      hoursInvested: (harvest.secondsInvested / 3600).toFixed(2),
      pomodoros: harvest.pomodoros,
      tasksCompleted: harvest.tasksCompleted,
    }));
  }

  async processDailyHarvest(date: string): Promise<{ date: string; count: number }> {
    // Fetch data to be processed for the day
    const dateInDayjs = dayjs(date);
    const dateInNumber = +dateInDayjs.format('YYYYMMDD');
    const dataToProcess = await this.fetchDataForDate(date); // This method should be implemented to fetch relevant data
    const countFinishedTasks = await this.tasksService.getAllFinishedTasksBetween(
      dateInDayjs.toDate(),
      dateInDayjs.add(1, 'day').toDate(),
    );

    // Process and create harvest records
    const userIdSet = new Set<string>();
    const createHarvestDtos: CreateHarvestRequestDto[] = [];
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
      createHarvestDtos.push(createHarvestDto);
    }

    // Create harvest records for users who didn't have any time logs
    countFinishedTasks.forEach((user) => {
      if (!userIdSet.has(user.userId)) {
        createHarvestDtos.push({
          userId: user.userId,
          date: dateInNumber,
          pomodoros: 0,
          tasksCompleted: user.totalFinishedTasks,
          secondsInvested: 0,
        });
      }
    });

    await this.createBulkHarvests(createHarvestDtos);
    return { date, count: createHarvestDtos.length };
  }

  private async fetchDataForDate(date: string): Promise<TimeLogGroupedByUserResponseDto[]> {
    return await this.timeLogService.getTimeLogsGroupedByUser(
      dayjs(date).format(),
      dayjs(date).add(1, 'day').format(),
    );
  }
}

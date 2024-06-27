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

  async processDailyHarvest(date: number): Promise<void> {
    // Fetch data to be processed for the day
    const dateString = date.toString(); // '20240605'
    const dateInDayjs = dayjs(dateString, 'YYYYMMDD');
    const formattedDate = dateInDayjs.format('YYYY-MM-DD'); // '2024-06-05'
    const dataToProcess = await this.fetchDataForDate(formattedDate); // This method should be implemented to fetch relevant data
    const countFinishedTasks = await this.tasksService.getAllFinishedTasksBetween(
      dateInDayjs.toDate(),
      dateInDayjs.add(1, 'day').toDate(),
    );

    // Process and create harvest records
    const harvestMap = new Map<string, CreateHarvestRequestDto>();
    for (const data of dataToProcess) {
      const userId = data.userId;
      const createHarvestDto: CreateHarvestRequestDto = {
        userId,
        date,
        pomodoros: data.totalPomodoros,
        tasksCompleted: 0,
        secondsInvested: data.totalSecondsInvested,
      };
      harvestMap.set(data.userId, createHarvestDto);
      await this.createHarvest(createHarvestDto);
    }
  }

  private async fetchDataForDate(date: string): Promise<TimeLogGroupedByUserResponseDto[]> {
    return await this.timeLogService.getTimeLogsGroupedByUser(
      dayjs(date).format(),
      dayjs(date).add(1, 'day').format(),
    );
  }
}

import { BaseService } from '@graba25-be/providers/base.service';
import { HarvestDbService } from '@graba25-be/providers/databases/db/services/harvest-db.service';
import { TimeLogDbService } from '@graba25-be/providers/databases/db/services/time-log-db.service';
import { CreateHarvestRequestDto } from '@graba25-be/shared/dtos/requests/harvest-request.dto';
import { HarvestResponseDto } from '@graba25-be/shared/dtos/responses/harvest-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HarvestService extends BaseService {
  constructor(
    private readonly harvestDbService: HarvestDbService,
    private readonly timeLogDbService: TimeLogDbService,
  ) {
    super();
  }

  async createHarvest(dto: CreateHarvestRequestDto): Promise<HarvestResponseDto> {
    const { userId, secondsInvested, date, id, pomodoros, tasksCompleted } =
      await this.harvestDbService.createHarvest(dto);
    const hoursInvested = (secondsInvested / 3600).toFixed(2);
    return {
      id,
      userId,
      date,
      hoursInvested,
      pomodoros,
      tasksCompleted,
    };
  }

  async processDailyHarvest(date: string): Promise<void> {
    // Fetch data to be processed for the day
    const dataToProcess = await this.fetchDataForDate(date); // This method should be implemented to fetch relevant data

    // Process and create harvest records
    for (const data of dataToProcess) {
      const createHarvestDto: CreateHarvestRequestDto = {
        userId: data.userId,
        date,
        pomodoros: data.pomodoros,
        tasksCompleted: data.tasksCompleted,
        secondsInvested: data.secondsInvested,
      };
      await this.createHarvest(createHarvestDto);
    }
  }

  private async fetchDataForDate(date: string): Promise<any[]> {
    // Implement logic to fetch data for the specified date

    // This is a placeholder and should be replaced with actual data fetching logic
    return [
      { userId: 'user1', pomodoros: 5, tasksCompleted: 3, secondsInvested: 7200 },
      { userId: 'user2', pomodoros: 4, tasksCompleted: 2, secondsInvested: 5400 },
    ];
  }
}

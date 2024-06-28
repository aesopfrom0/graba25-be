import { Harvest } from '@graba25-be/providers/databases/db/schemas/harvest.schema';
import { HarvestQueryDto } from '@graba25-be/shared/dtos/queries/harvest-query.dto';
import { CreateHarvestRequestDto } from '@graba25-be/shared/dtos/requests/harvest-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';

export class HarvestDbService {
  constructor(@InjectModel('Harvest') private readonly harvestModel: Model<Harvest>) {}

  async createHarvest(dto: CreateHarvestRequestDto): Promise<Harvest> {
    const harvest = new this.harvestModel(dto);
    return await harvest.save();
  }

  async createBulkHarvests(dtos: CreateHarvestRequestDto[]): Promise<Harvest[]> {
    return await this.harvestModel.insertMany(dtos);
  }

  async readHarvestsByUserId(userId: string, queryDto: HarvestQueryDto): Promise<Harvest[]> {
    const { gteDate, ltDate } = queryDto;

    // 날짜를 YYYYMMDD 형식의 숫자 타입으로 변환
    const gteDateNumber = parseInt(dayjs(gteDate).format('YYYYMMDD'), 10);
    const query: { userId: string; date: { $gte: number; $lt?: number } } = {
      userId,
      date: { $gte: gteDateNumber },
    };

    if (ltDate) {
      query.date.$lt = parseInt(dayjs(ltDate).format('YYYYMMDD'), 10);
    }

    return await this.harvestModel.find(query);
  }

  async readHarvestsByDate(date: number): Promise<Harvest | null> {
    return await this.harvestModel.findOne({ date });
  }
}

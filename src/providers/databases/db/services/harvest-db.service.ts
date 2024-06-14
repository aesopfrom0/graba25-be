import { Harvest } from '@graba25-be/providers/databases/db/schemas/harvest.schema';
import { CreateHarvestRequestDto } from '@graba25-be/shared/dtos/requests/harvest-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class HarvestDbService {
  constructor(@InjectModel('Harvest') private readonly harvestModel: Model<Harvest>) {}

  async createHarvest(dto: CreateHarvestRequestDto): Promise<Harvest> {
    const harvest = new this.harvestModel(dto);
    return await harvest.save();
  }
}

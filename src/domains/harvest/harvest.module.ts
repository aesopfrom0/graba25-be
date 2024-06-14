import { Module } from '@nestjs/common';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';
import { DbServicesModule } from '@graba25-be/providers/databases/db/db-services.module';

@Module({
  imports: [DbServicesModule],
  controllers: [HarvestController],
  providers: [HarvestService],
})
export class HarvestModule {}

import { Module } from '@nestjs/common';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';
import { DbServicesModule } from '@graba25-be/providers/databases/db/db-services.module';
import { TimeLogModule } from '@graba25-be/domains/time-log/time-log.module';

@Module({
  imports: [DbServicesModule, TimeLogModule],
  controllers: [HarvestController],
  providers: [HarvestService],
})
export class HarvestModule {}

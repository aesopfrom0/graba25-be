import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { HarvestModule } from '@graba25-be/domains/harvest/harvest.module';

@Module({
  imports: [HarvestModule],
  providers: [BatchService],
})
export class BatchModule {}

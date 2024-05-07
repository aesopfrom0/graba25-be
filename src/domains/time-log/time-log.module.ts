import { Module } from '@nestjs/common';
import { TimeLogController } from './time-log.controller';
import { TimeLogService } from './time-log.service';
import { DbServicesModule } from '@graba25-be/providers/databases/db/db-services.module';

@Module({
  imports: [DbServicesModule],
  controllers: [TimeLogController],
  providers: [TimeLogService],
})
export class TimeLogModule {}

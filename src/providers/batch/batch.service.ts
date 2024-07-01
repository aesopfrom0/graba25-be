import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs from 'dayjs';
import { HarvestService } from '@graba25-be/domains/harvest/harvest.service';
import { BaseService } from '@graba25-be/providers/base.service';
import ApplicationException from '@graba25-be/shared/exceptions/application.exception';
import { ErrorCode } from '@graba25-be/shared/exceptions/error-code';

@Injectable()
export class BatchService extends BaseService {
  constructor(private readonly harvestService: HarvestService) {
    super();
  }

  // 서버리스 환경에서는 아래 데코레이터가 동작하지 않음. serverless.yml에서 설정 필요
  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async recordHarvests(): Promise<{ date: string; count: number }> {
    const refDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    this.logger.log(`[${this.recordHarvests.name}] Recording harvests for ${refDate}`);
    try {
      const result = await this.harvestService.processDailyHarvest(refDate);
      if (!result.isNew) {
        this.logger.log(
          `[${this.recordHarvests.name}] Recorded ${result.count} harvests for ${refDate}`,
        );
      } else {
        this.logger.log(`[${this.recordHarvests.name}] No new harvests to record for ${refDate}`);
      }
      return result;
    } catch (e) {
      this.logger.error(`[${this.recordHarvests.name}] Error while recording harvests: ${e}`);
      throw new ApplicationException(
        new InternalServerErrorException('Harvest 기록 배치 에러'),
        ErrorCode.SYSTEM_ERROR,
      );
    }
  }
}

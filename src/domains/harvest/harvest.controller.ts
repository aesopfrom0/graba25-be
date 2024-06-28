import { HarvestService } from '@graba25-be/domains/harvest/harvest.service';
import { UserId } from '@graba25-be/shared/decorators/user-id.decorator';
import { HarvestQueryDto } from '@graba25-be/shared/dtos/queries/harvest-query.dto';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('harvest')
@UseGuards(AuthGuard('jwt'))
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Get('')
  async getHarvests(@UserId() userId: string, @Query() queryDto: HarvestQueryDto) {
    return await this.harvestService.harvests(userId, queryDto);
  }
}

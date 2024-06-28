import { IsDateString, IsOptional } from 'class-validator';

export class HarvestQueryDto {
  @IsDateString()
  gteDate!: string;

  @IsOptional()
  @IsDateString()
  ltDate?: string;
}

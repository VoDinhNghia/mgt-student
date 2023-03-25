import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryLeaderSchoolDto {
  @IsOptional()
  @ApiPropertyOptional()
  user?: string;
}

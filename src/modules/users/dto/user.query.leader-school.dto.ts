import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryLeaderSchoolDto {
  @ApiPropertyOptional()
  user?: string;
}

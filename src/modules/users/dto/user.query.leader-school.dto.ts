import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryLeaderSchoolDto {
  @IsOptional()
  @ApiProperty()
  user?: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class QueryLeaderSchoolDto {
  @ApiProperty({ required: false })
  user?: string;
}

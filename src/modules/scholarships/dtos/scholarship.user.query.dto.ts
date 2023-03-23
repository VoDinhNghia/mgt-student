import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUserScholarshipDto {
  @ApiPropertyOptional()
  scholarship?: string;

  @ApiPropertyOptional()
  user?: string;

  @ApiPropertyOptional()
  semester?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';

export class QueryLeaderSchoolDto extends QueryPagination {
  @IsOptional()
  @ApiPropertyOptional()
  user?: string;
}

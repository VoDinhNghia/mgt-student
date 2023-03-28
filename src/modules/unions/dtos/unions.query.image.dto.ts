import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';

export class QueryUnionImageDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  union?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPagination {
  @ApiPropertyOptional({ default: 10 })
  limit?: number;

  @ApiPropertyOptional({ default: 1 })
  page?: number;

  @ApiPropertyOptional()
  searchKey?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
export class QueryPovinceDto extends QueryPagination {
  @ApiPropertyOptional()
  countryId: string;
}

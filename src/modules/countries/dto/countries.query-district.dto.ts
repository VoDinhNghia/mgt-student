import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
export class QueryDistrictDto extends QueryPagination {
  @ApiPropertyOptional()
  provinceId: string;
}

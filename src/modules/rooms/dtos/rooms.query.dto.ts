import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';

export class QueryRoomDto extends QueryPagination {
  @ApiPropertyOptional()
  type?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
import { EtypeNews } from 'src/constants/constant';
export class QueryNewDto extends QueryPagination {
  @ApiPropertyOptional({ enum: EtypeNews, default: EtypeNews.UNIVERSITY })
  type?: string;
}

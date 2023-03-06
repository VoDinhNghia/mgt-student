import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/queryPaginationDto';
import { EtypeNews } from 'src/constants/constant';
export class QueryNewDto extends QueryPagination {
  @ApiProperty({ enum: EtypeNews, default: EtypeNews.UNIVERSITY })
  type?: string;
}

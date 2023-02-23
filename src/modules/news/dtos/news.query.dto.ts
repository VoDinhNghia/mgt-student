import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/abstracts/queryPaginationDto';
import { typeNews } from 'src/commons/constants';
export class QueryNewDto extends QueryPagination {
  @ApiProperty({ enum: typeNews, default: false })
  type?: string;
}

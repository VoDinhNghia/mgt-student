import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/abstracts/queryPaginationDto';

export class QueryRoomDto extends QueryPagination {
  @ApiProperty({ required: false })
  type?: string;
}

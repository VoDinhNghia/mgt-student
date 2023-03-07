import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';

export class QueryRoomDto extends QueryPagination {
  @ApiProperty({ required: false })
  type?: string;
}

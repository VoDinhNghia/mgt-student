import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';

export class QueryPermissionDto extends QueryPagination {
  @ApiProperty({ required: false })
  user?: string;
}

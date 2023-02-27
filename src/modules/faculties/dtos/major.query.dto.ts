import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/abstracts/queryPaginationDto';

export class MajorQueryDto extends QueryPagination {
  @ApiProperty({ required: false })
  faculty?: string;
}

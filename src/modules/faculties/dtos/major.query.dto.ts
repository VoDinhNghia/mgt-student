import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/queryPaginationDto';

export class MajorQueryDto extends QueryPagination {
  @ApiProperty({ required: false })
  faculty?: string;
}

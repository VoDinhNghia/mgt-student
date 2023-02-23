import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/abstracts/queryPaginationDto';

export class FacultyQueryDto extends QueryPagination {
  @ApiProperty({ required: false })
  branch?: string;
}

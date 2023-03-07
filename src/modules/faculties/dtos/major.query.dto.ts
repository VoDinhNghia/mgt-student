import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';

export class MajorQueryDto extends QueryPagination {
  @ApiProperty({ required: false })
  faculty?: string;
}

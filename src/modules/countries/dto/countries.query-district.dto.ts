import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/abstracts/queryPaginationDto';
export class QueryDistrictDto extends QueryPagination {
  @ApiProperty({ required: false })
  provinceId: string;
}

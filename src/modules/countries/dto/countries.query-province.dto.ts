import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/queryPaginationDto';
export class QueryPovinceDto extends QueryPagination {
  @ApiProperty({ required: false })
  countryId: string;
}

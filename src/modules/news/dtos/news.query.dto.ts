import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/queryPaginationDto';
import { typeNews } from 'src/constants/constant';
export class QueryNewDto extends QueryPagination {
  @ApiProperty({ enum: typeNews, default: false })
  type?: string;
}

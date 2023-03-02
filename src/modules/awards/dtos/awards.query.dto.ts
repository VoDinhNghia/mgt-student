import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/queryPaginationDto';
import { EtypeAward } from 'src/constants/constant';

export class QueryAwardDto extends QueryPagination {
  @ApiProperty({
    required: false,
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @ApiProperty({ required: false, default: '2023-12-01T00:00:01' })
  fromDate?: string;

  @ApiProperty({ required: false, default: '2023-12-01T23:59:59' })
  toDate?: string;
}

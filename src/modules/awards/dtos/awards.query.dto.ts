import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
import { EtypeAward } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class QueryAwardDto extends QueryPagination {
  @ApiProperty({
    required: false,
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @ApiProperty({
    required: false,
    default: `${new GetCurrentDate().getYearMonthDate()}T00:00:01`,
  })
  fromDate?: string;

  @ApiProperty({
    required: false,
    default: `${new GetCurrentDate().getYearMonthDate()}T00:00:01`,
  })
  toDate?: string;
}

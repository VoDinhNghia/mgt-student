import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
import { EtypeAward } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';

export class QueryAwardDto extends QueryPagination {
  @ApiPropertyOptional({
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @ApiPropertyOptional({
    default: `${new GetCurrentDate().getYearMonthDate()}T00:00:01`,
  })
  fromDate?: Date;

  @ApiPropertyOptional({
    default: `${new GetCurrentDate().getYearMonthDate()}T23:59:59`,
  })
  toDate?: Date;
}

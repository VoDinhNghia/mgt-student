import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
import { EtypeAward } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { IsOptional, IsString } from 'class-validator';

export class QueryAwardDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @IsOptional()
  @ApiProperty({
    default: `${new GetCurrentDate().getYearMonthDate()}T00:00:01`,
  })
  fromDate?: Date;

  @IsOptional()
  @ApiProperty({
    default: `${new GetCurrentDate().getYearMonthDate()}T23:59:59`,
  })
  toDate?: Date;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';
import { EtypeAward } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/utils.get.current-date';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAwardDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    enum: EtypeAward,
    default: EtypeAward.UNIVERSITY,
  })
  type?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    default: `${new GetCurrentDate().getYearMonthDate()}T00:00:01`,
  })
  fromDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({
    default: `${new GetCurrentDate().getYearMonthDate()}T23:59:59`,
  })
  toDate?: Date;
}

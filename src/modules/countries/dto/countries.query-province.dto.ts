import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
export class QueryPovinceDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  countryId: string;
}

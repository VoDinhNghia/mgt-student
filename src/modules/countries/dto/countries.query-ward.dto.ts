import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';
export class QueryWardDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  countryId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  provinceId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  districtId: string;
}

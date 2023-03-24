import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
export class QueryDistrictDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiProperty()
  provinceId: string;
}

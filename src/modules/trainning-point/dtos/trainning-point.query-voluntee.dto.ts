import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';

export class QueryVolunteeDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  faculty?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  semester?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  leader?: string;
}

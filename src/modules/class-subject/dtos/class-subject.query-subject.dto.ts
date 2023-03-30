import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';

export class QuerySubjectDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  major?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  course?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  semester?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  degreeLevel?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  lecturer?: string;
}

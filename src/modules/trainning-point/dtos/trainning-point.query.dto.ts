import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';

export class QueryTrainningPointDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  user?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  semester?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  program?: string;
}

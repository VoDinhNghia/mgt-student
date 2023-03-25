import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';

export class MajorQueryDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  faculty?: string;
}

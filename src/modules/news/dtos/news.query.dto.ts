import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';
import { EtypeNews } from 'src/constants/constant';
import { IsOptional, IsString } from 'class-validator';
export class QueryNewDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: EtypeNews, default: EtypeNews.UNIVERSITY })
  type?: string;
}

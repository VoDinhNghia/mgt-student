import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { EscholarshirpType } from 'src/constants/constant';
import { QueryPagination } from 'src/utils/utils.page.query.pagination.dto';

export class QueryScholarshipDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  semester?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    enum: EscholarshirpType,
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;
}

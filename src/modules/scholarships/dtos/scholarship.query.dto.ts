import { ApiPropertyOptional } from '@nestjs/swagger';
import { EscholarshirpType } from 'src/constants/constant';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';

export class QueryScholarshipDto extends QueryPagination {
  @ApiPropertyOptional()
  semester?: string;

  @ApiPropertyOptional({
    enum: EscholarshirpType,
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;
}

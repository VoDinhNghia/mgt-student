import { ApiProperty } from '@nestjs/swagger';
import { EscholarshirpType } from 'src/constants/constant';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';

export class QueryScholarshipDto extends QueryPagination {
  @ApiProperty({ required: false })
  semester?: string;

  @ApiProperty({
    required: false,
    enum: EscholarshirpType,
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;
}

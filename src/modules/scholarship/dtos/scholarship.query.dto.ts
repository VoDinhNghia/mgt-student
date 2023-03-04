import { ApiProperty } from '@nestjs/swagger';
import { EscholarshirpType } from 'src/constants/constant';
import { QueryPagination } from 'src/utils/queryPaginationDto';

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

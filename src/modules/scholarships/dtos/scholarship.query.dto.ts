import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { EscholarshirpType } from 'src/constants/constant';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';

export class QueryScholarshipDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiProperty()
  semester?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: EscholarshirpType,
    default: EscholarshirpType.EXCELLENCE,
  })
  type?: string;
}

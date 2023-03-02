import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/queryPaginationDto';
import { statusUser, ErolesEnum } from 'src/constants/constant';

export class UsersFillterDto extends QueryPagination {
  @ApiProperty({ required: false, enum: ErolesEnum })
  role?: string;

  @ApiProperty({ required: false, enum: statusUser.ENUM })
  status?: string;
}

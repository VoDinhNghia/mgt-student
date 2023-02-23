import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/abstracts/queryPaginationDto';
import { statusUser, ErolesEnum } from 'src/commons/constants';

export class UsersFillterDto extends QueryPagination {
  @ApiProperty({ required: false, enum: ErolesEnum })
  role?: string;

  @ApiProperty({ required: false, enum: statusUser.ENUM })
  status?: string;
}

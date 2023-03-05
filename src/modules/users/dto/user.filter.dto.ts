import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/queryPaginationDto';
import { EstatusUser, ErolesUser } from 'src/constants/constant';

export class UsersFillterDto extends QueryPagination {
  @ApiProperty({ required: false, enum: ErolesUser })
  role?: string;

  @ApiProperty({
    required: false,
    enum: EstatusUser,
    default: EstatusUser.ACTIVE,
  })
  status?: string;
}

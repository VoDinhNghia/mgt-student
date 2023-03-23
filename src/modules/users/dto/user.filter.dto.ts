import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
import { EstatusUser, ErolesUser } from 'src/constants/constant';

export class UsersFillterDto extends QueryPagination {
  @ApiPropertyOptional({ enum: ErolesUser })
  role?: string;

  @ApiPropertyOptional({
    enum: EstatusUser,
    default: EstatusUser.ACTIVE,
  })
  status?: string;
}

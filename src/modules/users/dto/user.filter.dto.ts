import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
import { EstatusUser, ErolesUser } from 'src/constants/constant';
import { IsOptional, IsString } from 'class-validator';

export class UsersFillterDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: ErolesUser })
  role?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    enum: EstatusUser,
    default: EstatusUser.ACTIVE,
  })
  status?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
import { EstatusUser, ErolesUser } from 'src/constants/constant';
import { IsOptional, IsString } from 'class-validator';

export class UsersFillterDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiProperty({ enum: ErolesUser })
  role?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: EstatusUser,
    default: EstatusUser.ACTIVE,
  })
  status?: string;
}

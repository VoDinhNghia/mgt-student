import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstatusUser } from 'src/constants/constant';

export class UsersUpdateDto {
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  role?: string;

  @ApiPropertyOptional({
    enum: EstatusUser,
    default: EstatusUser.INACTIVE,
  })
  status?: string;

  @ApiPropertyOptional({ maxLength: 20, minLength: 6 })
  passWord?: string;
}

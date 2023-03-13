import { ApiProperty } from '@nestjs/swagger';
import { EstatusUser } from 'src/constants/constant';

export class UsersUpdateDto {
  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  role?: string;

  @ApiProperty({
    required: false,
    enum: EstatusUser,
    default: EstatusUser.INACTIVE,
  })
  status?: string;

  @ApiProperty({ required: false, maxLength: 20, minLength: 6 })
  passWord?: string;
}
